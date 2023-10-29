import React from "react";
import PropTypes from "prop-types";
import { TwitterOutlined } from "@ant-design/icons";
import logo from "../logo.svg";
import alarmAudio from "../alarm.mp3";
import { Row, Col } from "antd";
import {
  getPastMonth,
  getPastWeek,
  getToday,
  getYesterday,
  isoFormat,
} from "../date_helper";
import { differenceInMonths } from "date-fns";
import FadeIn from "./FadeIn";
import AudioControls from "./AudioControls";
import { Statistic } from "antd";
import FadeInOut from "./FadeInOut";
import Util from "../util";
// import compareAsc from "date-fns/compareAsc";

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
        {alert.englishName || alert.name}
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
    alertSummaryCount: 0,
    alertSummaryTitle: "",
    alertSummaryText: "",
    twitterShareText: "",
    isLoading: true,
    isError: false,
    shouldRefresh: false,
    isAudioOn: false,
    alarm: null,
  };

  handleOnAudioChange = (isAudioOn) => {
    this.setState({ isAudioOn }, () => {
      if (isAudioOn) {
        if (!this.state.alarm) {
          const alarm = new Audio(alarmAudio);
          alarm.addEventListener("canplaythrough", (event) => {
            this.setState({ alarm });
          });
        }
      }
    });
  };

  componentDidMount() {
    this.getHeaderData();
    // Refresh header data every HEADER_ALERT_SUMMARY_REFRESH_INTERVAL
    this.headerDataRefreshInterval = setInterval(() => {
      this.getHeaderData();
    }, Util.HEADER_ALERT_SUMMARY_REFRESH_INTERVAL);
  }

  componentWillUnmount() {
    clearInterval(this.headerDataRefreshInterval);
  }

  /*
   * Queries the server every Gets all relevant alert data needed for the header alert summary.
   */
  getHeaderData() {
    const alertClient = this.props.alertClient;
    const today = isoFormat(getToday());
    const yesterday = isoFormat(getYesterday());
    const pastWeek = isoFormat(getPastWeek());
    const pastMonth = isoFormat(getPastMonth());

    Promise.all([
      alertClient.getTotalAlerts(today),
      alertClient.getTotalAlerts(yesterday, yesterday),
      alertClient.getTotalAlerts(pastWeek, today),
      alertClient.getTotalAlerts(pastMonth, today),
    ])
      .then((values) => {
        const todayAlertCount = values[0].success ? values[0].payload : 0;
        const yesterdayAlertCount = values[1].success ? values[1].payload : 0;
        const pastWeekAlertCount = values[2].success ? values[2].payload : 0;
        const pastMonthAlertCount = values[3].success ? values[3].payload : 0;
        this.setAlertSummary(
          todayAlertCount,
          yesterdayAlertCount,
          pastWeekAlertCount,
          pastMonthAlertCount
        );
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isError: true });
      });
  }

  /* Sets rocket alert summary in a simple, "human readable" form.
   * Prioritizes recent alerts over old ones.
   */
  setAlertSummary = async (
    todayAlertCount,
    yesterdayAlertCount,
    pastWeekAlertCount,
    pastMonthAlertCount
  ) => {
    let alertSummaryTitle = "";
    let alertSummaryText = "";
    let alertSummaryCount = 0;

    if (todayAlertCount > 0) {
      alertSummaryCount = todayAlertCount;
      alertSummaryTitle = `Rocket alerts today`;

      if (yesterdayAlertCount > 0) {
        alertSummaryText = `Yesterday, there were ${yesterdayAlertCount} rocket alerts`;
        if (
          pastWeekAlertCount > 0 &&
          yesterdayAlertCount !== pastWeekAlertCount
        ) {
          alertSummaryText += `,\nand a total of ${pastWeekAlertCount} in the past week`;
        } else if (
          pastMonthAlertCount > 0 &&
          pastWeekAlertCount !== pastMonthAlertCount
        ) {
          alertSummaryText += `,\nand a total of ${pastMonthAlertCount} in the past month`;
        }
      } else if (pastWeekAlertCount > 0) {
        alertSummaryText = `In the last week, there were ${pastWeekAlertCount} rocket alerts`;
        if (pastMonthAlertCount > 0) {
          alertSummaryText += `,\nand a total of ${pastMonthAlertCount} in the past month`;
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${pastMonthAlertCount} rocket alerts`;
      }
    } else if (yesterdayAlertCount > 0) {
      alertSummaryCount = yesterdayAlertCount;
      alertSummaryTitle = `Rocket alerts yesterday`;
      if (
        pastWeekAlertCount > 0 &&
        pastWeekAlertCount !== yesterdayAlertCount
      ) {
        alertSummaryText = `In the past week, there were ${pastWeekAlertCount} rocket alerts`;
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${pastMonthAlertCount} rocket alerts`;
      }
    } else if (pastWeekAlertCount > 0) {
      alertSummaryCount = pastWeekAlertCount;
      alertSummaryTitle = `Rocket alerts in the last week`;
      if (
        pastMonthAlertCount > 0 &&
        pastMonthAlertCount !== pastWeekAlertCount
      ) {
        alertSummaryText += `In the past month, there were ${pastMonthAlertCount} rocket alerts`;
      }
    } else if (pastMonthAlertCount > 0) {
      alertSummaryCount = pastMonthAlertCount;
      alertSummaryTitle = `Rocket alerts in the last month`;
    } else {
      await this.props.alertClient
        .getMostRecentAlert()
        .then((res) => {
          if (res.success) {
            const today = isoFormat(getToday());
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

    // if (Util.isLocalStorageAvailable()) {
    //   let alertTimestamp = localStorage.getItem("alertTimestamp");
    //   // compare timestamp of last server query with timestamp of most recent ream-time alert
    //   // if (compareAsc(new Date(), new Date(alertTimestamp)) === -1) {
    //   let locaRealTimeAlertCount = localStorage.getItem("alertCount");
    //   if (locaRealTimeAlertCount) {
    //     alertSummaryCount += +locaRealTimeAlertCount;
    //   }
    //   // }
    // }

    this.setState({
      alertSummaryCount,
      alertSummaryTitle,
      alertSummaryText,
      twitterShareText: `Rocket Alert in Israel: ${alertSummaryCount} ${alertSummaryTitle}. ${alertSummaryText}.`,
    });
  };

  componentDidUpdate(prevProps) {
    if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
      this.refreshAlert(this.props.realTimeAlert);
      this.updateCurrentAlertCount();
    }
  }

  refreshAlert = () => {
    this.setState({
      shouldRefresh: true,
    });
    if (this.state.isAudioOn && this.state.alarm && this.state.alarm.paused) {
      this.state.alarm.play();
    }
    setTimeout(() => {
      this.setState({ shouldRefresh: false });
    }, Util.REAL_TIME_ALERT_DISPLAY_DURATION);
  };

  updateCurrentAlertCount = () => {
    this.setState({ alertSummaryCount: this.state.alertSummaryCount + 1 });
    // if (Util.isLocalStorageAvailable()) {
    //   let alertCount = localStorage.getItem("alertCount");
    //   localStorage.setItem("alertCount", alertCount ? ++alertCount : 1);
    // }
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
          <Row gutter={[24, 24]} align="middle">
            <Col span={2}>
              <AudioControls
                onAudioChange={this.handleOnAudioChange}
                isAudioOn={this.state.isAudioOn}
              />
            </Col>
            <Col span={20}>
              <a
                href={`https://twitter.com/share?text=${this.state.twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                target="_blank"
                rel="noreferrer"
              >
                <div>
                  <TwitterOutlined
                    style={{ fontSize: "30px", color: "white" }}
                  />
                </div>
                <div>Share</div>
              </a>
            </Col>
          </Row>
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
