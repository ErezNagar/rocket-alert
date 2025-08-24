import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { getNow } from "../../utilities/date_helper";
import Tracking from "../../tracking";
import GraphTotalAlerts from "./GraphTotalAlerts";
import GraphAlertsByDay from "./GraphAlertsByDay";
import GraphAlertsBySource from "./GraphAlertsBySource";

const YEMEN_ALERT_TIMEFRAMES_URL =
  "https://raw.githubusercontent.com/ErezNagar/rocket-alert/refs/heads/master/src/data/yemen_alerts.json";

const AlertGraphs = ({ alertsClient }) => {
  const [alertData, setAlertData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);
  const [alertTimeframes, setAlertTimeframes] = useState({
    yemen: [],
    iran: [],
    falseAlerts: [],
  });

  useEffect(() => {
    const loadYemenAlertTimeframes = () =>
      wretch(YEMEN_ALERT_TIMEFRAMES_URL)
        .get()
        .json((res) =>
          res.map(([start, end]) => [new Date(start), new Date(end)])
        );
    const getDetailedAlerts = () =>
      alertsClient
        .getDetailedAlerts(new Date("2025-01-01"), getNow())
        .then((res) => res.payload)
        .catch((error) => {
          Tracking.detailedAlertsByDayError(error);
          console.error(error);
          return null;
        });

    Promise.all([getDetailedAlerts(), loadYemenAlertTimeframes()]).then(
      (values) => {
        const alertData = values[0] || [];
        const yemenAlertTimeframes = values[1] || [];

        setAlertTimeframes((state) => ({
          ...state,
          yemen: yemenAlertTimeframes,
        }));

        if (!alertData || alertData.length === 0) {
          setIsLoading(false);
          setIsError(true);
        }
        setIsLoading(false);
        setAlertData(alertData);
      }
    );
  }, [alertsClient]);

  return (
    <>
      <GraphTotalAlerts
        alertData={alertData}
        isLoading={isLoading}
        isError={isError}
      />
      <GraphAlertsBySource
        alertData={alertData}
        alertTimeframes={alertTimeframes}
        isLoading={isLoading}
        isError={isError}
      />
      <GraphAlertsByDay
        alertData={alertData}
        isLoading={isLoading}
        isError={isError}
      />
    </>
  );
};

AlertGraphs.propTypes = {
  alertsClient: PropTypes.object.isRequired,
};

export default AlertGraphs;
