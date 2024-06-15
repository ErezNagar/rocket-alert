import React from "react";
import PropTypes from "prop-types";
import { ReactComponent as TwitterLogo } from "../assets/twitter.svg";
import logo from "../assets/logo.svg";
import alarmAudio from "../assets/alarm.mp3";
import { Row, Col } from "antd";
import { getNow, getStartOfToday, getStartOfYesterday, getEndOfYesterday, getPastWeek, getPastMonth } from "../date_helper";
import { differenceInMonths } from "date-fns";
import FadeIn from "./FadeIn";
import AudioControls from "./AudioControls";
import { Statistic, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import FadeInOut from "./FadeInOut";
import Util from "../util";
import Tracking from "../tracking";
import { withTranslation } from "react-i18next";

const HeaderContent = ({ alertSummaryTitle, alertSummaryText, alertSummaryCount, isLoading, t }) => (
  <>
    {isLoading ? (
      <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: "white" }} spin />} />
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
  t: PropTypes.func.isRequired,
};
HeaderContent.defaultProps = {
  alertSummaryTitle: "",
  alertSummaryText: "",
  alertSummaryCount: 0,
};

const AlertModeHeaderContent = ({ shouldRefresh, alert, t }) => {
  let alertText = "";
  if (alert.alertTypeId === Util.ALERT_TYPE_ROCKETS) {
    alertText = t("rocket_alert");
  } else if (alert.alertTypeId === Util.ALERT_TYPE_UAV) {
    alertText = t("uav_alert");
  } else {
    alertText = t("red_alert");
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
  t: PropTypes.func.isRequired,
};
AlertModeHeaderContent.defaultProps = {
  shouldRefresh: false,
  alert: {},
};

const languages = [
  { code: "en", text: "Real time red alerts in Israel" },
  { code: "de", text: "Echtzeit Raketenalarmierungen aus Israel" },
  { code: "ru", text: "Сирены тревоги в реальном времени в Израиле" },
  { code: "ua", text: "Червоні тривоги в режимі реального часу в Ізраїлі" },
  { code: "he", text: "אזעקות אדומות בזמן אמת בישראל" },
  { code: "in", text: "Israel में रीयल-टाइम रेड अलर्ट" },
  { code: "af", text: "Regstreekse rooi alarms in Israel" }
];

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
    currentLanguageIndex: 0,
  };

  componentDidMount() {
    this.getHeaderData();
    this.languageInterval = setInterval(this.changeLanguage, 5000); // Wechsel alle 5 Sekunden
  }

  componentWillUnmount() {
    clearInterval(this.languageInterval);
  }

  changeLanguage = () => {
    this.setState((prevState) => ({
      currentLanguageIndex: (prevState.currentLanguageIndex + 1) % languages.length,
    }));
  };

  getHeaderData() {
    const alertClient = this.props.alertClient;
    const now = getNow();

    const startOfToday = getStartOfToday();
    const startOfYesterday = getStartOfYesterday();
    const endOfYesterday = getEndOfYesterday();
    const pastWeek = getPastWeek();
    const pastMonth = getPastMonth();

    Promise.all([
      alertClient.getTotalAlerts(startOfToday, now, Util.ALERT_TYPE_ALL),
      alertClient.getTotalAlerts(startOfYesterday, endOfYesterday, Util.ALERT_TYPE_ALL),
      alertClient.getTotalAlerts(pastWeek, now, Util.ALERT_TYPE_ALL),
      alertClient.getTotalAlerts(pastMonth, now, Util.ALERT_TYPE_ALL),
      alertClient.getRealTimeAlertCache(),
    ])
      .then((values) => {
        const todayAlertCount = values[0].success ? values[0].payload : 0;
        const yesterdayAlertCount = values[1].success ? values[1].payload : 0;
        const pastWeekAlertCount = values[2].success ? values[2].payload : 0;
        const pastMonthAlertCount = values[3].success ? values[3].payload : 0;
        const realTimeAlertCacheCount = values[4] ? values[4] : [];
        this.setAlertSummary(
          todayAlertCount + realTimeAlertCacheCount.count,
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

  setAlertSummary = async (
    todayAlertCount,
    yesterdayAlertCount,
    pastWeekAlertCount,
    pastMonthAlertCount
  ) => {
    const { t } = this.props;

    let alertSummaryTitle = "";
    let alertSummaryText = "";
    let alertSummaryCount = 0;

    if (todayAlertCount > 0) {
      alertSummaryCount = todayAlertCount;
      alertSummaryTitle = t("alert_today");

      if (yesterdayAlertCount > 0) {
        alertSummaryText = t("alert_yesterday", { count: yesterdayAlertCount });
        if (
          pastWeekAlertCount > 0 &&
          yesterdayAlertCount !== pastWeekAlertCount
        ) {
          alertSummaryText += t("alert_week", { count: pastWeekAlertCount });
        } else if (
          pastMonthAlertCount > 0 &&
          pastWeekAlertCount !== pastMonthAlertCount
        ) {
          alertSummaryText += t("alert_month", { count: pastMonthAlertCount });
        }
      } else if (pastWeekAlertCount > 0) {
        alertSummaryText = t("alert_week", { count: pastWeekAlertCount });
        if (pastMonthAlertCount > 0) {
          alertSummaryText += t("alert_month", { count: pastMonthAlertCount });
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = t("alert_month", { count: pastMonthAlertCount });
      }
    } else if (yesterdayAlertCount > 0) {
      alertSummaryCount = yesterdayAlertCount;
      alertSummaryTitle = t("alert_yesterday");
      if (
        pastWeekAlertCount > 0 &&
        pastWeekAlertCount !== yesterdayAlertCount
      ) {
        alertSummaryText += t("alert_week", { count: pastWeekAlertCount });
        if (
          pastMonthAlertCount > 0 &&
          pastWeekAlertCount !== pastMonthAlertCount
        ) {
          alertSummaryText += t("alert_month", { count: pastMonthAlertCount });
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = t("alert_month", { count: pastMonthAlertCount });
      }
    } else if (pastWeekAlertCount > 0) {
      alertSummaryCount = pastWeekAlertCount;
      alertSummaryTitle = t("alert_week");
      if (
        pastMonthAlertCount > 0 &&
        pastMonthAlertCount !== pastWeekAlertCount
      ) {
        alertSummaryText += t("alert_month", { count: pastMonthAlertCount });
      }
    } else if (pastMonthAlertCount > 0) {
      alertSummaryCount = pastMonthAlertCount;
      alertSummaryTitle = t("alert_month");
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
              alertSummaryTitle = t("alert_last_month");
            }
            if (monthsAgo > 1) {
              alertSummaryTitle = t("alert_last_months", { count: monthsAgo });
            }
          }
        })
        .catch((err) => {
          Tracking.mostRecentAlertError(err);
          console.error("Error getMostRecentAlert()", err);
        });
    }

    const twitterShareText = `${alertSummaryTitle}: ${alertSummaryCount} ${alertSummaryText}.`;
    this.setState({
      alertSummaryCount,
      alertSummaryTitle,
      alertSummaryText,
      twitterShareText,
      isLoading: false,
    });
    this.props.onTwitterShareText(twitterShareText);
  };

  componentDidUpdate(prevProps) {
    if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
      this.refreshAlert(this.props.realTimeAlert);
      if (this.props.isLastAlertOfBatch) {
        this.updateCurrentAlertCount();
      }
    }
  }

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
    const { t } = this.props;
    const { currentLanguageIndex } = this.state;
    const currentLanguageText = languages[currentLanguageIndex].text;
    return (
      <header className={this.props.isAlertMode ? "header alert-mode" : "header"}>
        <div className="header-top">
          <img className="logo" src={logo} alt="" />
          <h2 className="animated-text">{currentLanguageText}</h2>
        </div>
        <div className="header-content">
          {!this.state.isError && this.props.isAlertMode && (
            <AlertModeHeaderContent
              shouldRefresh={this.state.shouldRefresh}
              alert={this.props.realTimeAlert}
              todayAlertCount={this.state.todayAlertCount}
              t={t}
            />
          )}
          {!this.state.isError && !this.props.isAlertMode && (
            <HeaderContent
              alertSummaryTitle={this.state.alertSummaryTitle}
              alertSummaryText={this.state.alertSummaryText}
              alertSummaryCount={this.state.alertSummaryCount}
              isLoading={this.state.isLoading}
              t={t}
            />
          )}
          {this.state.isError && (
            <h3 className="error">{t("data_unavailable")}</h3>
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
                    {t("share")}
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
  isLastAlertOfBatch: PropTypes.bool.isRequired,
  t: PropTypes.func.isRequired,
};

Header.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
};

export default withTranslation()(Header);
