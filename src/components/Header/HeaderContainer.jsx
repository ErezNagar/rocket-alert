import * as Sentry from "@sentry/react";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import { getNow } from "../../utilities/date_helper";
import Tracking from "../../tracking";
import { differenceInMonths } from "date-fns";

const HeaderContainer = (props) => {
  const [todayAlertCount, setTodayAlertCount] = useState(null);
  const [yesterdayAlertCount, setYesterdayAlertCount] = useState(null);
  const [pastWeekAlertCount, setPastWeekAlertCount] = useState(null);
  const [pastMonthAlertCount, setPastMonthAlertCount] = useState(null);
  const [mostRcentAlertAge, setMostRcentAlertAge] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const logHeaderLoadingTime = (perfStartTime) => {
    const perfTime = performance.now() - perfStartTime;
    if (perfTime && !Number.isNaN(perfTime)) {
      Sentry.metrics.distribution("header", perfTime, {
        unit: "millisecond",
      });
    }
  };

  const getMostRecentAlert = () => {
    return props.alertClient
      .getMostRecentAlert()
      .then((res) => {
        if (res.success) {
          const monthsAgo = differenceInMonths(
            getNow(),
            new Date(res.payload.date),
          );
          setMostRcentAlertAge(monthsAgo);
        }
      })
      .catch((err) => {
        Tracking.mostRecentAlertError(err);
        setIsError(true);
        setIsLoading(false);
        console.error("Error getMostRecentAlert()", err);
      });
  };

  // Gets the user's timezone, defaults to "Asia/Jerusalem".
  const getTimezone = () => {
    try {
      const tz = Intl?.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) {
        return tz;
      }
    } catch (e) {}
    return "Asia/Jerusalem";
  };

  /*
   * Gets total alert count for today, yesterday, past week and past month.s
   */
  const getHeaderData = () => {
    props.alertClient
      .getHeaderData(getTimezone())
      .then((res) => {
        if (!res.success) {
          throw new Error("Failed to get header data");
        }

        const { today, yesterday, pastWeek, pastMonth } = res.payload;
        setTodayAlertCount(today + props.realTimeAlertCache.count);
        setYesterdayAlertCount(yesterday);
        setPastWeekAlertCount(pastWeek);
        setPastMonthAlertCount(pastMonth);

        if (
          today === 0 &&
          yesterday === 0 &&
          pastWeek === 0 &&
          pastMonth === 0
        ) {
          getMostRecentAlert().then(() =>
            logHeaderLoadingTime(props.perfStartTime),
          );
        } else {
          logHeaderLoadingTime(props.perfStartTime);
        }
      })
      .catch((error) => {
        Tracking.headerDataError(error);
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      });
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (props.realTimeAlertCache.count !== null) {
      getHeaderData();
    }
  }, [props.realTimeAlertCache]);
  /* eslint-enable react-hooks/exhaustive-deps */

  useEffect(() => {
    if (
      todayAlertCount ||
      yesterdayAlertCount ||
      pastWeekAlertCount ||
      pastMonthAlertCount ||
      mostRcentAlertAge
    ) {
      setIsLoading(false);
    }
  }, [
    todayAlertCount,
    yesterdayAlertCount,
    pastWeekAlertCount,
    pastMonthAlertCount,
    mostRcentAlertAge,
  ]);

  return (
    <Header
      isAlertMode={props.isAlertMode}
      realTimeAlert={props.realTimeAlert}
      isLastAlertOfBatch={props.isLastAlertOfBatch}
      onTwitterShareText={props.onTwitterShareText}
      todayAlertCount={todayAlertCount}
      yesterdayAlertCount={yesterdayAlertCount}
      pastWeekAlertCount={pastWeekAlertCount}
      pastMonthAlertCount={pastMonthAlertCount}
      mostRcentAlertAge={mostRcentAlertAge}
      isLoading={isLoading}
      isError={isError}
    />
  );
};

HeaderContainer.propTypes = {
  alertClient: PropTypes.object.isRequired,
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
  realTimeAlertCache: PropTypes.object.isRequired,
  onTwitterShareText: PropTypes.func.isRequired,
  isLastAlertOfBatch: PropTypes.bool.isRequired,
  perfStartTime: PropTypes.number.isRequired,
};

HeaderContainer.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
};

export default HeaderContainer;
