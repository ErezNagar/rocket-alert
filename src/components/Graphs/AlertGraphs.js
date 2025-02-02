import PropTypes from "prop-types";
import React from "react";
import { getNow } from "../../date_helper";
import Tracking from "../../tracking";
import GraphTotalAlerts from "./GraphTotalAlerts";
import GraphAlertsByDay from "./GraphAlertsByDay";
import GraphAlertsBySource from "./GraphAlertsBySource";
import Util from "../../util";

class AlertGraphs extends React.Component {
  state = {
    alertData: null,
    rocketAlertData: null,
    UAVAlertData: null,
    isLoading: true,
    isError: false,
  };

  componentDidMount() {
    this.getDetailedAlerts().then((alertData) => {
      if (!alertData || alertData.length === 0) {
        this.setState({ isError: true, isLoading: false });
      }
      const rocketAlertData = this.filterAlertsByType(
        alertData,
        Util.ALERT_TYPE_ROCKETS
      );
      const UAVAlertData = this.filterAlertsByType(
        alertData,
        Util.ALERT_TYPE_UAV
      );
      this.setState({
        alertData,
        rocketAlertData,
        UAVAlertData,
        isLoading: false,
      });
    });
  }

  getDetailedAlerts = () =>
    this.props.alertsClient
      .getDetailedAlerts(new Date("2025-01-01"), getNow())
      .then((res) => res.payload)
      .catch((error) => {
        Tracking.detailedAlertsByDayError(error);
        console.error(error);
        return null;
      });

  filterAlertsByType = (alertData, alertTypeId) =>
    alertData.map((obj) => ({
      alerts: obj.alerts.filter((alert) => alert.alertTypeId === alertTypeId),
      date: obj.date,
    }));

  render() {
    return (
      <>
        <GraphTotalAlerts
          alertData={this.state.alertData}
          isLoading={this.state.isLoading}
          isError={this.state.isError}
        />
        <GraphAlertsBySource
          alertData={this.state.alertData}
          isLoading={this.state.isLoading}
          isError={this.state.isError}
        />
        <GraphAlertsByDay
          alertData={this.state.alertData}
          isLoading={this.state.isLoading}
          isError={this.state.isError}
        />
      </>
    );
  }
}

AlertGraphs.propTypes = {
  alertsClient: PropTypes.object.isRequired,
};

export default AlertGraphs;
