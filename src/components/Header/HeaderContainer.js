import * as Sentry from "@sentry/react";
import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import { getNow } from "../../utilities/date_helper";
import Tracking from "../../tracking";
import { differenceInMonths } from "date-fns";

const HeaderContainer = (props) => {
  const [todayAlertCount, setTodayAlertCount] = useState(0);
  const [yesterdayAlertCount, setYesterdayAlertCount] = useState(0);
  const [pastWeekAlertCount, setPastWeekAlertCount] = useState(0);
  const [pastMonthAlertCount, setPastMonthAlertCount] = useState(0);
  const [mostRcentAlertAge, setMostRcentAlertAge] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getMostRecentAlert = () => {
    props.alertClient
      .getMostRecentAlert()
      .then((res) => {
        if (res.success) {
          const monthsAgo = differenceInMonths(
            getNow(),
            new Date(res.payload.date),
          );
          setMostRcentAlertAge(monthsAgo);
          setIsLoading(false);
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
        const { today, yesterday, lastWeek, lastMonth } = res.payload;

        setTodayAlertCount(today + props.realTimeAlertCache.count);
        setYesterdayAlertCount(yesterday);
        setPastWeekAlertCount(lastWeek);
        setPastMonthAlertCount(lastMonth);

        if (
          today === 0 &&
          yesterday === 0 &&
          lastWeek === 0 &&
          lastMonth === 0
        ) {
          getMostRecentAlert();
        } else {
          setIsLoading(false);
        }
        const perfTime = performance.now() - props.perfStartTime;
        if (perfTime && !Number.isNaN(perfTime)) {
          Sentry.metrics.distribution("header", perfTime, {
            unit: "millisecond",
          });
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
