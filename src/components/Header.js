import React from "react";
import PropTypes from "prop-types";
import { TwitterOutlined } from "@ant-design/icons";
import logo from "../logo.svg";
import { getPastWeek, getToday } from "../date_helper";
import { differenceInMonths } from "date-fns";
import AlertClient from "../rocket_alert_client";
import FadeIn from "./FadeIn";
import { Statistic, Spin } from "antd";

const today = getToday();
// const today = "2021-05-20";
const week = getPastWeek();
// const week = "2021-05-13";
const month = getPastWeek();
// const month = "2021-04-13";

class Header extends React.Component {
  state = {
    alerts: {},
    todayAlertCount: 0,
    weekAlertCount: 0,
    monthAlertCount: 0,
    alertSummaryCount: 0,
    alertSummaryTitle: "",
    alertSummaryText: "",
    isLoading: true,
  };

  getAlerts = (from, to) => AlertClient.getTotalAlerts(from, to);

  getAlertsToday = () => {
    AlertClient.getTotalAlerts(today, today)
      .then((res) => {
        console.log("today", res.payload);
        this.setState({ todayAlertCount: res.payload });
      })
      .catch((error) => {
        console.error(error);
        // this.setState({ isError: true });
      });
  };

  getAlertsWeek = () => {
    AlertClient.getTotalAlerts(week, today)
      .then((res) => {
        console.log("week", res.payload);
        this.setState({ weekAlertCount: res.payload });
      })
      .catch((error) => {
        console.error(error);
        // this.setState({ isError: true });
      });
  };

  getAlertsMonth = () => {
    AlertClient.getTotalAlerts(month, today)
      .then((res) => {
        console.log("month", res.payload);
        this.setState({ monthAlertCount: res.payload });
      })
      .catch((error) => {
        console.error(error);
        // this.setState({ isError: true });
      });
  };

  componentDidMount() {
    Promise.all([
      // TODO: Update range to account for overlaps
      this.getAlerts(today, today),
      // this.getAlerts(week, null),
      this.getAlerts(week, today),
      this.getAlerts(month, today),
    ])
      .then((values) => {
        this.setState(
          {
            todayAlertCount: values[0].payload,
            weekAlertCount: values[1].payload,
            monthAlertCount: values[2].payload,
          },
          () => {
            this.setAlertSummary();
          }
        );
      })
      .catch((error) => {
        console.error(error);
        // TODO: fallback gracefuly
        // this.setState({ isError: true });
      });
  }

  /* Sets rocket alert summary in a simple, "human readable" form.
   * Prioritize recent alerts over old ones.
   */
  setAlertSummary = () => {
    let alertSummaryTitle = "";
    let alertSummaryText = "";
    let alertSummaryCount = 0;

    if (this.state.todayAlertCount > 0) {
      alertSummaryCount = this.state.todayAlertCount;
      alertSummaryTitle = `Rocket alerts today`;
      if (this.state.weekAlertCount > 0) {
        alertSummaryText = `Last week, there were ${this.state.weekAlertCount} rocket alerts`;
        if (this.state.monthAlertCount > 0) {
          alertSummaryText += `,\nand a total of ${this.state.monthAlertCount} in the past month`;
        }
      } else if (this.state.monthAlertCount > 0) {
        alertSummaryText = `.\nIn the past month, there were ${this.state.monthAlertCount} rocket alerts`;
      }
    } else if (this.state.weekAlertCount > 0) {
      alertSummaryCount = this.state.weekAlertCount;
      alertSummaryTitle = `Rocket alerts in the last week`;
      if (this.state.monthAlertCount > 0) {
        alertSummaryText += `.\nIn the past month, there were ${this.state.monthAlertCount} rocket alerts`;
      }
    } else if (this.state.monthAlertCount > 0) {
      alertSummaryCount = this.state.monthAlertCount;
      alertSummaryTitle = `Rocket alerts in the last month`;
    } else {
      const monthsAgo = differenceInMonths(
        new Date(today),
        new Date("2021-07-16")
      );
      alertSummaryTitle = `Last rocket alert was ${monthsAgo} months ago`;
    }
    this.setState({ alertSummaryCount, alertSummaryTitle, alertSummaryText });
  };

  render() {
    return (
      <header className="header">
        <div className="top">
          <img className="logo" src={logo} alt="" />
          <h2>Real-time rocket alerts in Israel</h2>
        </div>
        <div className="tile-hero">
          {this.state.alertSummaryCount === 0 ? (
            <div className="ant-statistic-content-value-int"></div>
          ) : (
            <FadeIn show={true} fadeInOnly>
              <Statistic value={this.state.alertSummaryCount} />
            </FadeIn>
          )}
          <h3>{this.state.alertSummaryTitle}</h3>
          <div className="summary-text">{this.state.alertSummaryText}</div>
        </div>
        <div className="share">
          <a
            href="https://twitter.com/intent/tweet?button_hashtag=RocketAlert&ref_src=twsrc%5Etfw"
            data-show-count="false"
            data-text="custom share text"
            data-url="https://dev.twitter.com/web/tweet-button"
            data-hashtags="example,demo"
            data-via="twitterdev"
            data-related="twitterapi,twitter"
          >
            <div>
              <TwitterOutlined style={{ fontSize: "20px", color: "white" }} />
            </div>
            <div>#RocketAlert</div>
          </a>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  getYesterday() {},
  alertClient: PropTypes.object.isRequired,
};

Header.defaultProps = {
  getYesterday: () => {},
};

export default Header;
