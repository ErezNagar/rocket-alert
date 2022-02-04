import React from "react";
import PropTypes from "prop-types";
import FadeInOut from "./FadeInOut";
import { TwitterOutlined } from "@ant-design/icons";
// import { Statistic } from "antd";
import logo from "../logo.svg";

class AlertModeStickyHeader extends React.Component {
  static propTypes = {
    showStickyHeader: PropTypes.bool,
    isAlertMode: PropTypes.bool,
    realTimeAlert: PropTypes.object,
  };

  static defaultProps = {
    showStickyHeader: false,
    isAlertMode: false,
    realTimeAlert: {},
  };

  state = {
    shouldRefresh: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
      this.refreshAlert(this.props.realTimeAlert);
    }
  }

  refreshAlert = () => {
    this.setState({
      shouldRefresh: true,
    });
    setTimeout(() => {
      this.setState({ shouldRefresh: false });
    }, 2000);
  };

  setStickyHeaderStyle = () => {
    let cssClass = "sticky-header";
    if (this.props.showStickyHeader) {
      cssClass += " active";
    }
    if (this.props.isAlertMode) {
      cssClass += " alert-mode";
    }
    return cssClass;
  };

  render() {
    return (
      <header className={this.setStickyHeaderStyle()}>
        <div className="left-container">
          <div>
            <img className="logo" src={logo} alt="" />
          </div>
          <div className="alerts">{/* <Statistic value={7325} /> */}</div>
          {this.props.isAlertMode && this.props.realTimeAlert && (
            <div>
              <FadeInOut show={this.state.shouldRefresh}>
                {`Rocket alert: ${this.props.realTimeAlert.name}`}
              </FadeInOut>
            </div>
          )}
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
