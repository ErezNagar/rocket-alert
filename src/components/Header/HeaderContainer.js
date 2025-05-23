import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import Header from "./Header";
import {
  getNow,
  getStartOfToday,
  getStartOfYesterday,
  getEndOfYesterday,
  getPastWeek,
  getPastMonth,
} from "../../date_helper";
import Util from "../../util";
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
            new Date(res.payload.date)
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

  /*
   * Queries the server to get alert data for the header alert summary.
     Fetches today's, yesterday's, past week's and past month's data, in local time.
   */
  const getHeaderData = () => {
    const alertClient = props.alertClient;
    const now = getNow();

    const startOfToday = getStartOfToday();
    const startOfYesterday = getStartOfYesterday();
    const endOfYesterday = getEndOfYesterday();
    const pastWeek = getPastWeek();
    const pastMonth = getPastMonth();

    Promise.all([
      alertClient.getTotalAlerts(startOfToday, now),
      alertClient.getTotalAlerts(
        startOfYesterday,
        endOfYesterday,
        Util.ALERT_TYPE_ALL
      ),
      alertClient.getTotalAlerts(pastWeek, now),
      alertClient.getTotalAlerts(pastMonth, now),
    ])
      .then((values) => {
        const todayAlertCount = values[0].success ? values[0].payload : 0;
        const yesterdayAlertCount = values[1].success ? values[1].payload : 0;
        const pastWeekAlertCount = values[2].success ? values[2].payload : 0;
        const pastMonthAlertCount = values[3].success ? values[3].payload : 0;
        setTodayAlertCount(todayAlertCount + props.realTimeAlertCache.count);
        setYesterdayAlertCount(yesterdayAlertCount);
        setPastWeekAlertCount(pastWeekAlertCount);
        setPastMonthAlertCount(pastMonthAlertCount);

        if (
          todayAlertCount === 0 &&
          yesterdayAlertCount === 0 &&
          pastWeekAlertCount === 0 &&
          pastMonthAlertCount === 0
        ) {
          getMostRecentAlert();
        } else {
          setIsLoading(false);
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
      advanceNotices={props.advanceNotices}
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
  realTimeAlert: PropTypes.object,
  realTimeAlertCache: PropTypes.object.isRequired,
  onTwitterShareText: PropTypes.func.isRequired,
  isLastAlertOfBatch: PropTypes.bool.isRequired,
  advanceNotices: PropTypes.array.isRequired,
};

HeaderContainer.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
};

export default HeaderContainer;
