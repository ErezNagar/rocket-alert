import PropTypes from "prop-types";
import React from "react";
import { getNow } from "../date_helper";
import Tracking from "../tracking";
import GraphTotalAlerts from "./GraphTotalAlerts";
import GraphAlertsByDay from "./GraphAlertsByDay";
import GraphAlertsBySource from "./GraphAlertsBySource";

class AlertGraphs extends React.Component {
  state = {
    alertData: null,
    isLoading: true,
    isError: false,
  };

  componentDidMount() {
    this.getDetailedAlerts().then((alertData) => {
      if (!alertData || alertData.length === 0) {
        this.setState({ isError: true, isLoading: false });
      }
      this.setState({ alertData, isLoading: false });
    });
  }

  getDetailedAlerts = () =>
    this.props.alertsClient
      .getDetailedAlerts(new Date("2023-10-07"), getNow())
      .then((res) => res.payload)
      .catch((error) => {
        Tracking.detailedAlertsByDayError(error);
        console.error(error);
        return null;
      });

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
