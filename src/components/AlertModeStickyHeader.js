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
    alert: {},
  };

  componentDidMount() {}

  componentDidUpdate(prevProps) {
    if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
      this.showAlert(this.props.realTimeAlert);
    }
  }

  showAlert = (alert) => {
    this.setState({
      shouldRefresh: true,
      alert,
    });
    setTimeout(() => {
      this.setState({ shouldRefresh: false });
    }, 2000);
  };

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
              {`Rocket alert: ${this.state.alert.name}`}
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
