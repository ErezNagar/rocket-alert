import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as TwitterLogo } from "../assets/twitter.svg";
import logo from "../assets/logo.svg";
import alarmAudio from "../assets/alarm.mp3";
import { Row, Col } from "antd";
import {
  getNow,
  getStartOfToday,
  getStartOfYesterday,
  getEndOfYesterday,
  getPastWeek,
  getPastMonth,
} from "../date_helper";
import { differenceInMonths } from "date-fns";
import FadeIn from "./FadeIn";
import AudioControls from "./AudioControls";
import { Statistic, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import FadeInOut from "./FadeInOut";
import Util from "../util";
import Tracking from "../tracking";

const HeaderContent = ({
  alertSummaryTitle,
  alertSummaryText,
  alertSummaryCount,
  isLoading,
}) => (
  <>
    {isLoading ? (
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 36, color: "white" }} spin />
        }
      />
    ) : (
      <>
        {alertSummaryCount > 0 && (
          <FadeIn show={true}>
            <Statistic value={alertSummaryCount} />
          </FadeIn>
        )}
        <h3>{alertSummaryTitle}</h3>
        <div className="summary-text">{alertSummaryText}</div>
      </>
    )}
  </>
);

HeaderContent.propTypes = {
  alertSummaryTitle: PropTypes.string,
  alertSummaryText: PropTypes.string,
  alertSummaryCount: PropTypes.number,
  isLoading: PropTypes.bool.isRequired,
};
HeaderContent.defaultProps = {
  alertSummaryTitle: "",
  alertSummaryText: "",
  alertSummaryCount: 0,
};

const AlertModeHeaderContent = ({ shouldRefresh, alert }) => {
  let alertText = "";
  if (alert.alertTypeId === Util.ALERT_TYPE_ROCKETS) {
    alertText = "Rocket alert";
  } else if (
    alert.alertTypeId === Util.ALERT_TYPE_UAV ||
    alert.alertTypeId === 6
  ) {
    alertText = "UAV alert";
  } else {
    alertText = "Red alert";
  }
  return (
    <>
      <h3>{alertText}</h3>
      <div className="alert">
        <FadeInOut show={shouldRefresh}>
          {alert.englishName || alert.name}
        </FadeInOut>
      </div>
    </>
  );
};

AlertModeHeaderContent.propTypes = {
  shouldRefresh: PropTypes.bool,
  alert: PropTypes.object,
};
AlertModeHeaderContent.defaultProps = {
  shouldRefresh: false,
  alert: {},
};

class Header extends React.Component {
  state = {
    alerts: {},
    todayAlertCount: 0,
    yesterdayAlertCount: 0,
    pastWeekAlertCount: 0,
    pastMonthAlertCount: 0,
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

  componentDidMount() {
    console.log("componentDidMount");
    this.getHeaderData();
  }

  componentDidUpdate(prevProps) {
    if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
      this.refreshAlert(this.props.realTimeAlert);
      this.updateCurrentAlertCount();
    }
    if (this.props.mostRecentAlertCache !== prevProps.mostRecentAlertCache) {
      this.setAlertSummary(
        this.state.todayAlertCount + this.props.mostRecentAlertCache.count,
        this.state.yesterdayAlertCount,
        this.state.pastWeekAlertCount,
        this.state.pastMonthAlertCount
      );
    }
  }

  /*
   * Queries the server to get alert data for the header alert summary.
     Fetches today's, yesterday's, past week's and past month's data, in local time.
   */
  getHeaderData() {
    const alertClient = this.props.alertClient;
    const now = getNow();

    const startOfToday = getStartOfToday();
    const startOfYesterday = getStartOfYesterday();
    const endOfYesterday = getEndOfYesterday();
    const pastWeek = getPastWeek();
    const pastMonth = getPastMonth();

    Promise.all([
      alertClient.getTotalAlerts(startOfToday, now),
      alertClient.getTotalAlerts(startOfYesterday, endOfYesterday),
      alertClient.getTotalAlerts(pastWeek, now),
      alertClient.getTotalAlerts(pastMonth, now),
    ])
      .then((values) => {
        const todayAlertCount = values[0].success ? values[0].payload : 0;
        const yesterdayAlertCount = values[1].success ? values[1].payload : 0;
        const pastWeekAlertCount = values[2].success ? values[2].payload : 0;
        const pastMonthAlertCount = values[3].success ? values[3].payload : 0;
        this.setState({
          todayAlertCount,
          yesterdayAlertCount,
          pastWeekAlertCount,
          pastMonthAlertCount,
        });
        this.setAlertSummary(
          todayAlertCount + this.props.mostRecentAlertCache.count,
          yesterdayAlertCount,
          pastWeekAlertCount,
          pastMonthAlertCount
        );
      })
      .catch((error) => {
        Tracking.headerDataError(error);
        console.error(error);
        this.setState({ isError: true, isLoading: false });
      });
  }

  /* Sets rocket alert summary text in a simple, human readable form.
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
      alertSummaryTitle = `Red alerts today`;

      if (yesterdayAlertCount > 0) {
        alertSummaryText = `Yesterday, there were ${yesterdayAlertCount} alerts`;
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
        alertSummaryText = `In the past week, there were ${pastWeekAlertCount} alerts`;
        if (pastMonthAlertCount > 0) {
          alertSummaryText += `,\nand a total of ${pastMonthAlertCount} in the past month`;
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${pastMonthAlertCount} alerts`;
      }
    } else if (yesterdayAlertCount > 0) {
      alertSummaryCount = yesterdayAlertCount;
      alertSummaryTitle = `Red alerts yesterday`;
      if (
        pastWeekAlertCount > 0 &&
        pastWeekAlertCount !== yesterdayAlertCount
      ) {
        alertSummaryText = `In the past week, there were ${pastWeekAlertCount} alerts`;
        if (
          pastMonthAlertCount > 0 &&
          pastWeekAlertCount !== pastMonthAlertCount
        ) {
          alertSummaryText += `,\nand a total of ${pastMonthAlertCount} in the past month`;
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${pastMonthAlertCount} alerts`;
      }
    } else if (pastWeekAlertCount > 0) {
      alertSummaryCount = pastWeekAlertCount;
      alertSummaryTitle = `Red alerts in the past week`;
      if (
        pastMonthAlertCount > 0 &&
        pastMonthAlertCount !== pastWeekAlertCount
      ) {
        alertSummaryText += `In the past month, there were ${pastMonthAlertCount} alerts`;
      }
    } else if (pastMonthAlertCount > 0) {
      alertSummaryCount = pastMonthAlertCount;
      alertSummaryTitle = `Red alerts in the last month`;
    } else {
      await this.props.alertClient
        .getMostRecentAlert()
        .then((res) => {
          if (res.success) {
            const monthsAgo = differenceInMonths(
              getNow(),
              new Date(res.payload.date)
            );
            if (monthsAgo <= 1) {
              alertSummaryTitle = `Last red alert was a month ago`;
            }
            if (monthsAgo > 1) {
              alertSummaryTitle = `Last red alert was ${monthsAgo} months ago`;
            }
          }
        })
        .catch((err) => {
          Tracking.mostRecentAlertError(err);
          console.error("Error getMostRecentAlert()", err);
        });
    }

    const twitterShareText = `Rocket Alert in Israel: ${alertSummaryCount} ${alertSummaryTitle}. ${alertSummaryText}.`;
    this.setState({
      alertSummaryCount,
      alertSummaryTitle,
      alertSummaryText,
      twitterShareText,
      isLoading: false,
    });
    this.props.onTwitterShareText(twitterShareText);
  };

  refreshAlert = () => {
    this.setState({
      shouldRefresh: true,
    });
    if (this.state.isAudioOn && this.state.alarm && this.state.alarm.paused) {
      this.state.alarm.play();
      Tracking.alarmPlayedEvent();
    }
    setTimeout(() => {
      this.setState({ shouldRefresh: false });
    }, Util.REAL_TIME_ALERT_DISPLAY_DURATION);
  };

  updateCurrentAlertCount = () => {
    this.setState({ alertSummaryCount: this.state.alertSummaryCount + 1 });
  };

  handleOnAudioChange = (isAudioOn) => {
    Tracking.alarmAudioClick(isAudioOn);
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

  render() {
    return (
      <header
        className={this.props.isAlertMode ? "header alert-mode" : "header"}
      >
        <div className="header-top">
          <img className="logo" src={logo} alt="" />
          <h2>Real-time red alerts in Israel</h2>
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
              isLoading={this.state.isLoading}
            />
          )}
          {this.state.isError && (
            <h3 className="error">Data currently unavailable</h3>
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
              <Row>
                <Col span={24}>
                  <a
                    href={`https://twitter.com/share?text=${this.state.twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={Tracking.shareHeaderClick}
                  >
                    <TwitterLogo style={{ height: "36px" }} />
                  </a>
                </Col>
                <Col span={24}>
                  <a
                    href={`https://twitter.com/share?text=${this.state.twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                    target="_blank"
                    rel="noreferrer"
                    onClick={Tracking.shareHeaderClick}
                  >
                    Share
                  </a>
                </Col>
              </Row>
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
  onTwitterShareText: PropTypes.func.isRequired,
  mostRecentAlertCache: PropTypes.object.isRequired,
};

Header.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
};

export default Header;
