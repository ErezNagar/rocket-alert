import React from "react";
import PropTypes from "prop-types";
import FadeInOut from "./FadeInOut";
import { TwitterOutlined } from "@ant-design/icons";
import { Statistic } from "antd";

class StickyHeader extends React.Component {
  static propTypes = {
    randomString: PropTypes.string,
  };

  static defaultProps = {
    randomString: "",
  };

  state = {
    shouldRefresh: false,
    location: "",
    locations: [
      "Nahal Oz",
      "Nativ Haasara",
      "Sderot",
      "Beersheba",
      "Mefalsim",
      "Tkuma",
    ],
  };

  componentDidUpdate(prevProps) {
    // Typical usage (don't forget to compare props):
    if (this.props.randomString !== prevProps.randomString) {
      // this.setState({ shouldRefresh: false }, () => {
      //   setTimeout(() => {
      //     this.setState({ shouldRefresh: true });
      //   }, 1000);
      // });
    }
  }

  componentDidMount() {
    let i = 0;
    setInterval(() => {
      this.refreshLocation(this.state.locations[i++]);
      if (i === this.state.locations.length) {
        i = 0;
      }
    }, 2500);
  }

  refreshLocation = (location) => {
    setTimeout(() => {
      this.setState({ location, shouldRefresh: true });
      setTimeout(() => {
        this.setState({ shouldRefresh: false });
      }, 2000);
    }, 1);
  };

  render() {
    return (
      <header className="sticky-header active">
        <div className="left-container">
          <div className="title">Ra</div>
          <div className="alerts">
            <Statistic value={7325} />
          </div>
          <div>
            <FadeInOut show={this.state.shouldRefresh}>
              {`Rocket alert: ${this.state.location}`}
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

export default StickyHeader;
