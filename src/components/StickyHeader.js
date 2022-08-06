import React from "react";
import PropTypes from "prop-types";
import FadeInOut from "./FadeInOut";
import { TwitterOutlined } from "@ant-design/icons";
// import { Statistic } from "antd";
import logo from "../logo.svg";
import Util from "../util";
import { parseISO, format } from "date-fns";

class StickyHeader extends React.Component {
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
    }, Util.REAL_TIME_ALERT_DISPLAY_DURATION);
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
    const { isAlertMode, realTimeAlert } = this.props;
    return (
      <header className={this.setStickyHeaderStyle()}>
        <div className="left-container">
          <img className="logo" src={logo} alt="" />
        </div>
        <div className="alerts">
          {isAlertMode && realTimeAlert && (
            <div>
              <FadeInOut show={this.state.shouldRefresh}>
                {format(parseISO(realTimeAlert.timeStamp), "HH:mm")}{" "}
                {realTimeAlert.englishName || realTimeAlert.name}
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

StickyHeader.propTypes = {
  showStickyHeader: PropTypes.bool,
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.object,
};

StickyHeader.defaultProps = {
  showStickyHeader: false,
  isAlertMode: false,
  realTimeAlert: {},
};

export default StickyHeader;
