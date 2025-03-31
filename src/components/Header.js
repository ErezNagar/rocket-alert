import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as TwitterLogo } from "../assets/twitter.svg";
import logo from "../assets/logo.svg";
import alarmAudio from "../assets/alarm.mp3";
import { Row, Col } from "antd";
import { differenceInMonths } from "date-fns";
import FadeIn from "./FadeIn";
import AudioControls from "./AudioControls";
import { Statistic, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import FadeInOut from "./FadeInOut";
import Util from "../util";
import Tracking from "../tracking";
import { getNow } from "../date_helper";
import AlertClient from "../rocket_alert_client";

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

const AlertModeHeaderContent = ({ shouldRefresh, alert }) => (
  <>
    <h3>{Util.getAlertTypeText(alert)}</h3>
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
};
AlertModeHeaderContent.defaultProps = {
  shouldRefresh: false,
  alert: {},
};

const Header = ({
  isAlertMode,
  realTimeAlert,
  isLastAlertOfBatch,
  onTwitterShareText,
  todayAlertCount,
  yesterdayAlertCount,
  pastWeekAlertCount,
  pastMonthAlertCount,
  isLoading,
  isError,
}) => {
  const [headerText, setHeaderText] = useState({
    alertSummaryCount: 0,
    alertSummaryTitle: "",
    alertSummaryText: "",
  });
  const [twitterShareText, setTwitterShareText] = useState("");
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [alarm, setAlarm] = useState(null);

  const getAlertSummaryText = (timePeriodText, alertCount) =>
    `${timePeriodText}, there were ${alertCount} red alerts`;

  const appendAlertSummaryText = (timePeriodText, alertCount) =>
    `,\nand a total of ${alertCount} ${timePeriodText}`;

  /* Sets red alert summary text in a simple, human readable form.
   * Prioritizes recent alerts over old ones.
   */
  const setAlertSummary = (
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
        alertSummaryText = getAlertSummaryText(
          "Yesterday",
          yesterdayAlertCount
        );
        if (
          pastWeekAlertCount > 0 &&
          yesterdayAlertCount !== pastWeekAlertCount
        ) {
          alertSummaryText += appendAlertSummaryText(
            "in the past week",
            pastWeekAlertCount
          );
        } else if (
          pastMonthAlertCount > 0 &&
          pastWeekAlertCount !== pastMonthAlertCount
        ) {
          alertSummaryText += appendAlertSummaryText(
            "in the past month",
            pastMonthAlertCount
          );
        }
      } else if (pastWeekAlertCount > 0) {
        alertSummaryText = getAlertSummaryText(
          "In the past week",
          pastWeekAlertCount
        );
        if (pastMonthAlertCount > 0) {
          alertSummaryText += appendAlertSummaryText(
            "in the past month",
            pastMonthAlertCount
          );
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = getAlertSummaryText(
          "In the past month",
          pastMonthAlertCount
        );
      }
    } else if (yesterdayAlertCount > 0) {
      alertSummaryCount = yesterdayAlertCount;
      alertSummaryTitle = `Red alerts yesterday`;
      if (
        pastWeekAlertCount > 0 &&
        pastWeekAlertCount !== yesterdayAlertCount
      ) {
        alertSummaryText = getAlertSummaryText(
          "In the past week",
          pastWeekAlertCount
        );
        if (
          pastMonthAlertCount > 0 &&
          pastWeekAlertCount !== pastMonthAlertCount
        ) {
          alertSummaryText += appendAlertSummaryText(
            "in the past month",
            pastMonthAlertCount
          );
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = getAlertSummaryText(
          "In the past month",
          pastMonthAlertCount
        );
      }
    } else if (pastWeekAlertCount > 0) {
      alertSummaryCount = pastWeekAlertCount;
      alertSummaryTitle = `Red alerts in the past week`;
      if (
        pastMonthAlertCount > 0 &&
        pastMonthAlertCount !== pastWeekAlertCount
      ) {
        alertSummaryText += getAlertSummaryText(
          "In the past month",
          pastMonthAlertCount
        );
      }
    } else if (pastMonthAlertCount > 0) {
      alertSummaryCount = pastMonthAlertCount;
      alertSummaryTitle = `Red alerts in the last month`;
    } else {
      AlertClient.getMostRecentAlert()
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
          setHeaderText({
            alertSummaryCount,
            alertSummaryTitle,
            alertSummaryText,
          });
        })
        .catch((err) => {
          Tracking.mostRecentAlertError(err);
          console.error("Error getMostRecentAlert()", err);
        });
    }

    const twitterShareText = `Red Alert in Israel: ${alertSummaryCount} ${alertSummaryTitle}. ${alertSummaryText}.`;
    setHeaderText({ alertSummaryCount, alertSummaryTitle, alertSummaryText });
    setTwitterShareText(twitterShareText);
    onTwitterShareText(twitterShareText);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    setAlertSummary(
      todayAlertCount,
      yesterdayAlertCount,
      pastWeekAlertCount,
      pastMonthAlertCount
    );
  }, [
    todayAlertCount,
    yesterdayAlertCount,
    pastWeekAlertCount,
    pastMonthAlertCount,
  ]);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    refreshAlert(realTimeAlert);
    if (isLastAlertOfBatch) {
      setHeaderText({
        ...headerText,
        alertSummaryCount: headerText.alertSummaryCount + 1,
      });
    }
  }, [realTimeAlert]);
  /* eslint-enable react-hooks/exhaustive-deps */

  const refreshAlert = () => {
    setShouldRefresh(true);
    if (isAudioOn && alarm && alarm.paused) {
      alarm.play();
      Tracking.alarmPlayedEvent();
    }
    setTimeout(() => {
      setShouldRefresh(false);
    }, Util.REAL_TIME_ALERT_DISPLAY_DURATION);
  };

  const handleOnAudioChange = (isAudioOn) => {
    Tracking.alarmAudioClick(isAudioOn);
    setIsAudioOn(isAudioOn, () => {
      if (isAudioOn) {
        if (!alarm) {
          const alarm = new Audio(alarmAudio);
          alarm.addEventListener("canplaythrough", (event) => {
            setAlarm(alarm);
          });
        }
      }
    });
  };

  return (
    <header className={isAlertMode ? "header alert-mode" : "header"}>
      <div className="header-top">
        <img className="logo" src={logo} alt="" />
        <h2>Real-time red alerts in Israel</h2>
      </div>
      <div className="header-content">
        {!isError && isAlertMode && (
          <AlertModeHeaderContent
            shouldRefresh={shouldRefresh}
            alert={realTimeAlert}
          />
        )}
        {!isError && !isAlertMode && (
          <HeaderContent
            alertSummaryTitle={headerText.alertSummaryTitle}
            alertSummaryText={headerText.alertSummaryText}
            alertSummaryCount={headerText.alertSummaryCount}
            isLoading={isLoading}
          />
        )}
        {isError && <h3 className="error">Data currently unavailable</h3>}
      </div>
      <div className="header-bottom">
        <Row gutter={[24, 24]} align="middle">
          <Col span={2}>
            <AudioControls
              onAudioChange={handleOnAudioChange}
              isAudioOn={isAudioOn}
            />
          </Col>
          <Col span={20}>
            <Row>
              <Col span={24}>
                <a
                  href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                  target="_blank"
                  rel="noreferrer"
                  onClick={Tracking.shareHeaderClick}
                >
                  <TwitterLogo style={{ height: "36px" }} />
                </a>
              </Col>
              <Col span={24}>
                <a
                  href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
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
};

Header.propTypes = {
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.object,
  onTwitterShareText: PropTypes.func,
  isLastAlertOfBatch: PropTypes.bool,
  todayAlertCount: PropTypes.number.isRequired,
  yesterdayAlertCount: PropTypes.number.isRequired,
  pastWeekAlertCount: PropTypes.number.isRequired,
  pastMonthAlertCount: PropTypes.number.isRequired,
  isError: PropTypes.bool,
  isLoading: PropTypes.bool,
};

Header.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
  onTwitterShareText: () => {},
  isLastAlertOfBatch: false,
  isError: false,
  isLoading: false,
};

export default Header;
