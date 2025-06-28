import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { getNow } from "../../utilities/date_helper";
import Tracking from "../../tracking";
import GraphTotalAlerts from "./GraphTotalAlerts";
import GraphAlertsByDay from "./GraphAlertsByDay";
import GraphAlertsBySource from "./GraphAlertsBySource";

const AlertGraphs = ({ alertsClient }) => {
  const [alertData, setAlertData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getDetailedAlerts = () =>
      alertsClient
        .getDetailedAlerts(new Date("2025-01-01"), getNow())
        .then((res) => res.payload)
        .catch((error) => {
          Tracking.detailedAlertsByDayError(error);
          console.error(error);
          return null;
        });

    getDetailedAlerts().then((alertData) => {
      if (!alertData || alertData.length === 0) {
        setIsLoading(false);
        setIsError(true);
      }
      setIsLoading(false);
      setAlertData(alertData);
    });
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
