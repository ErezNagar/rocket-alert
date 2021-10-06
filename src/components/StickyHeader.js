import React from "react";
import PropTypes from "prop-types";
import { TwitterOutlined } from "@ant-design/icons";
import { Statistic } from "antd";

class StickyHeader extends React.Component {
  static propTypes = {};

  static defaultProps = {};

  state = {};

  render() {
    return (
      <header className="sticky-header active">
        <div className="left-container">
          <div className="title">Ra</div>
          <div className="alerts">
            <Statistic value={7325} />
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

export default StickyHeader;
