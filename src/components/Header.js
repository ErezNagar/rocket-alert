import React from "react";
import PropTypes from "prop-types";
import { TwitterOutlined } from "@ant-design/icons";
import logo from "../logo.svg";
import {
  getPastMonth,
  getPastWeek,
  getToday,
  getYesterday,
  isoFormat,
} from "../date_helper";
import { differenceInMonths } from "date-fns";
import FadeIn from "./FadeIn";
import FormattedTimeAlert from "./FormattedTimeAlert";
import { Statistic } from "antd";
import FadeInOut from "./FadeInOut";
import Util from "../util";

const today = isoFormat(getToday());
const yesterday = isoFormat(getYesterday());
const week = isoFormat(getPastWeek());
const month = isoFormat(getPastMonth());

const HeaderContent = ({
  alertSummaryTitle,
  alertSummaryText,
  alertSummaryCount,
}) => (
  <>
    {alertSummaryCount > 0 && (
      <FadeIn show={true} fadeInOnly>
        <Statistic value={alertSummaryCount} />
      </FadeIn>
    )}
    <h3>{alertSummaryTitle}</h3>
    <div className="summary-text">{alertSummaryText}</div>
  </>
);

HeaderContent.propTypes = {
  alertSummaryTitle: PropTypes.string,
  alertSummaryText: PropTypes.string,
  alertSummaryCount: PropTypes.number,
};
HeaderContent.defaultProps = {
  alertSummaryTitle: "",
  alertSummaryText: "",
  alertSummaryCount: 0,
};

const AlertModeHeaderContent = ({ shouldRefresh, alert }) => (
  <>
    <h3>Rocket alert</h3>
    <div className="alert">
      <FadeInOut show={shouldRefresh}>
        <FormattedTimeAlert alert={alert} /> {alert.englishName || alert.name}
      </FadeInOut>
    </div>
  </>
);

AlertModeHeaderContent.propTypes = {
  shouldRefresh: PropTypes.bool,
  alert: PropTypes.object,
  alertSummaryCount: PropTypes.number,
};
AlertModeHeaderContent.defaultProps = {
  shouldRefresh: false,
  alert: {},
  alertSummaryCount: 0,
};

class Header extends React.Component {
  state = {
    alerts: {},
    todayAlertCount: 0,
    yesterdayAlertCount: 0,
    weekAlertCount: 0,
    monthAlertCount: 0,
    alertSummaryCount: 0,
    alertSummaryTitle: "",
    alertSummaryText: "",
    twitterShareText: "",
    isLoading: true,
    isError: false,
    shouldRefresh: false,
  };

  componentDidMount() {
    const alertClient = this.props.alertClient;
    Promise.all([
      alertClient.getTotalAlerts(today),
      alertClient.getTotalAlerts(yesterday, yesterday),
      alertClient.getTotalAlerts(week, today),
      alertClient.getTotalAlerts(month, today),
    ])
      .then((values) => {
        this.setState(
          {
            todayAlertCount: values[0].success ? values[0].payload : 0,
            yesterdayAlertCount: values[1].success ? values[1].payload : 0,
            weekAlertCount: values[2].success ? values[2].payload : 0,
            monthAlertCount: values[3].success ? values[3].payload : 0,
          },
          () => {
            this.setAlertSummary();
          }
        );
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isError: true });
      });
  }

  /* Sets rocket alert summary in a simple, "human readable" form.
   * Prioritize recent alerts over old ones.
   */
  setAlertSummary = async () => {
    let alertSummaryTitle = "";
    let alertSummaryText = "";
    let alertSummaryCount = 0;

    if (this.state.todayAlertCount > 0) {
      alertSummaryCount = this.state.todayAlertCount;
      alertSummaryTitle = `Rocket alerts today`;

      if (this.state.yesterdayAlertCount > 0) {
        alertSummaryText = `Yesterday, there were ${this.state.yesterdayAlertCount} rocket alerts`;
        if (
          this.state.weekAlertCount > 0 &&
          this.state.yesterdayAlertCount !== this.state.weekAlertCount
        ) {
          alertSummaryText += `,\nand a total of ${this.state.weekAlertCount} in the past week`;
        } else if (
          this.state.monthAlertCount > 0 &&
          this.state.weekAlertCount !== this.state.monthAlertCount
        ) {
          alertSummaryText += `,\nand a total of ${this.state.monthAlertCount} in the past month`;
        }
      } else if (this.state.weekAlertCount > 0) {
        alertSummaryText = `Last week, there were ${this.state.weekAlertCount} rocket alerts`;
        if (this.state.monthAlertCount > 0) {
          alertSummaryText += `,\nand a total of ${this.state.monthAlertCount} in the past month`;
        }
      } else if (this.state.monthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${this.state.monthAlertCount} rocket alerts`;
      }
    } else if (this.state.yesterdayAlertCount > 0) {
      alertSummaryCount = this.state.yesterdayAlertCount;
      alertSummaryTitle = `Rocket alerts yesterday`;
      if (
        this.state.weekAlertCount > 0 &&
        this.state.weekAlertCount !== this.state.yesterdayAlertCount
      ) {
        alertSummaryText += `In the past week, there were ${this.state.weekAlertCount} rocket alerts`;
      }
    } else if (this.state.weekAlertCount > 0) {
      alertSummaryCount = this.state.weekAlertCount;
      alertSummaryTitle = `Rocket alerts in the last week`;
      if (
        this.state.monthAlertCount > 0 &&
        this.state.monthAlertCount !== this.state.weekAlertCount
      ) {
        alertSummaryText += `In the past month, there were ${this.state.monthAlertCount} rocket alerts`;
      }
    } else if (this.state.monthAlertCount > 0) {
      alertSummaryCount = this.state.monthAlertCount;
      alertSummaryTitle = `Rocket alerts in the last month`;
    } else {
      await this.props.alertClient
        .getMostRecentAlert()
        .then((res) => {
          if (res.success) {
            const monthsAgo = differenceInMonths(
              new Date(today),
              new Date(res.payload.date)
            );
            if (monthsAgo === 1) {
              alertSummaryTitle = `Last rocket alert was a month ago`;
            }
            if (monthsAgo > 1) {
              alertSummaryTitle = `Last rocket alert was ${monthsAgo} months ago`;
            }
          }
        })
        .catch((err) => {
          console.error("Error getMostRecentAlert()", err);
        });
    }
    this.setState({
      alertSummaryCount,
      alertSummaryTitle,
      alertSummaryText,
      twitterShareText: `Rocket Alert in Israel!                                                             ${alertSummaryCount} ${alertSummaryTitle}. ${alertSummaryText}`,
    });
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

  render() {
    return (
      <header
        className={this.props.isAlertMode ? "header alert-mode" : "header"}
      >
        <div className="header-top">
          <img className="logo" src={logo} alt="" />
          <h2>Real-time rocket alerts in Israel</h2>
        </div>
        <div className="header-content">
          {!this.state.isError && this.props.isAlertMode && (
            <AlertModeHeaderContent
              shouldRefresh={this.state.shouldRefresh}
              alert={this.props.realTimeAlert}
              todayAlertCount={this.state.todayAlertCount}
            />
          )}
          {!this.state.isError && !this.props.isAlertMode && (
            <HeaderContent
              alertSummaryTitle={this.state.alertSummaryTitle}
              alertSummaryText={this.state.alertSummaryText}
              alertSummaryCount={this.state.alertSummaryCount}
            />
          )}
          {this.state.isError && (
            <h3 className="error">Data is currently unavailable</h3>
          )}
        </div>
        <div className="header-bottom">
          <a
            href={`https://twitter.com/share?text=${this.state.twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
            target="_blank"
            rel="noreferrer"
          >
            <div>
              <TwitterOutlined style={{ fontSize: "30px", color: "white" }} />
            </div>
            <div>Share</div>
          </a>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  alertClient: PropTypes.object.isRequired,
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.object,
};

Header.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
};

export default Header;
