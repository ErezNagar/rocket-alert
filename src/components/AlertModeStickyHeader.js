import React from "react";
import PropTypes from "prop-types";
import FadeInOut from "./FadeInOut";
import { TwitterOutlined } from "@ant-design/icons";
import { Statistic } from "antd";
import logo from "../logo.svg";

class AlertModeStickyHeader extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  state = {
    shouldRefresh: false,
    locations: [
      "Nahal Oz",
      "Nativ Haasara",
      "Sderot",
      "Beersheba",
      "Mefalsim",
      "Tkuma",
    ],
    alertQueue: [],
    alertQueueInterval: null,
  };

  alertQueue = [
    "test 1",
    "test 2",
    "test 3",
    "test 4",
    "test 5",
    "test 6",
    "test 7",
    "test 8",
    "test 9",
    "test 10",
    "test 11",
    "test 12",
    "test 13",
    "test 14",
    "test 15",
  ];

  componentDidMount() {
    const alertQueueInterval = setInterval(() => {
      if (this.alertQueue.length > 0) {
        this.showAlert();
      }
    }, 3000); //display time + transition time
    this.setState({ alertQueueInterval });
  }

  componentDidUpdate(prevProps) {
    // if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
    //   this.refreshAlert(this.props.realTimeAlert);
    // }
  }

  componentWillUnmount() {
    clearInterval(this.state.alertQueueInterval);
  }

  showAlert = () => {
    const alert = this.alertQueue.shift();
    console.log("new alert:", `${alert}`);
    this.setState({
      shouldRefresh: true,
      alert,
    });
    setTimeout(() => {
      this.setState({ shouldRefresh: false });
    }, 2000);
  };

  // refreshAlert = (alert) => {
  //   this.alertQueue.push(`${alert.name} ${this.alertQueue.length + 1}`);
  //   console.log("new alert:", `${alert.name} ${this.alertQueue.length}`);
  //   this.setState({
  //     // alertQueue: { ...this.alertQueue },
  //     shouldRefresh: true,
  //   });
  //   setTimeout(() => {
  //     this.setState({ shouldRefresh: false });
  //   }, 2000);
  // };

  render() {
    return (
      <header className="sticky-header alert-mode active">
        <div className="left-container">
          <div>
            <img className="logo" src={logo} alt="" />
          </div>
          <div className="alerts">
            <Statistic value={7325} />
          </div>
          <div>
            <FadeInOut show={this.state.shouldRefresh}>
              {`Rocket alert: ${this.state.alert}`}
            </FadeInOut>
          </div>
        </div>
        <div className="right-container">
          <TwitterOutlined style={{ fontSize: "24px", color: "white" }} />
          #RocketAlerts
        </div>
      </header>
    );
  }
}

export default AlertModeStickyHeader;
