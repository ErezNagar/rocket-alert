import React from "react";
import MoveIn from "./MoveIn";
import pinIcon from "../pinicon.svg";
// import PropTypes from "prop-types";

class LiveAlerts extends React.Component {
  state = {
    shouldRefreshAlert: false,
    incomingAlerts: [
      "15:24: Nahal Oz",
      "15:24: Nativ Haasara",
      "15:24: Sderot",
      "15:25: Beersheba",
      "15:25: Mefalsim",
      "15:25: Tkuma",
      "15:25: Nahal Oz",
      "15:25: Nativ Haasara",
      "15:26: Sderot",
      "15:26: Beersheba",
      "15:27: Mefalsim",
      "15:27: Tkuma",
    ],
    newAlert: "",
    alertList: [],
  };

  componentDidMount() {
    let i = 0;
    // TODO: Clear interval
    setInterval(() => {
      this.showNewAlert(this.state.incomingAlerts[i++]);
      if (i === this.state.incomingAlerts.length) {
        i = 0;
      }
    }, 2000);
  }

  showNewAlert = (newAlert) => {
    const alertList = [newAlert, ...this.state.alertList];
    setTimeout(() => {
      this.setState({
        alertList,
        shouldRefreshAlert: true,
      });
      setTimeout(() => {
        this.setState({
          shouldRefreshAlert: false,
        });
      }, 1500);
    }, 1);
  };

  render() {
    return (
      <div className="live-alerts-container">
        <h2>Alerts now</h2>
        <div className="alerts">
          {this.state.alertList.map((alert, i) => (
            <MoveIn
              shouldShow={this.state.shouldRefreshAlert}
              key={`${alert}_${i}`}
            >
              <div className="alert-item">
                <img className="pin-icon" src={pinIcon} alt="alert" />
                {alert}
              </div>
            </MoveIn>
          ))}
        </div>
      </div>
    );
  }
}

export default LiveAlerts;
