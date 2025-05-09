import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { ReactComponent as TwitterLogo } from "../../assets/twitter.svg";
import logo from "../../assets/logo.svg";
import alarmAudio from "../../assets/alarm.mp3";
import { Row, Col } from "antd";
import AudioControls from "./AudioControls";
import HeaderHero from "./HeaderHero";
import AlertModeHeaderHero from "./AlertModeHeaderHero";
import Util from "../../util";
import Tracking from "../../tracking";

const Header = ({
  isAlertMode,
  realTimeAlert,
  isLastAlertOfBatch,
  onTwitterShareText,
  todayAlertCount,
  yesterdayAlertCount,
  pastWeekAlertCount,
  pastMonthAlertCount,
  mostRcentAlertAge,
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

  // Audio is not working on iPhone devices due to a bug in Safari that prevents audio from playing without user interaction.
  const isIphone = () =>
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;

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
    pastMonthAlertCount,
    mostRcentAlertAge
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
      if (mostRcentAlertAge <= 1) {
        alertSummaryTitle = `Last red alert was a month ago`;
      }
      if (mostRcentAlertAge > 1) {
        alertSummaryTitle = `Last red alert was ${mostRcentAlertAge} months ago`;
      }
      setHeaderText({
        alertSummaryCount,
        alertSummaryTitle,
        alertSummaryText,
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
      pastMonthAlertCount,
      mostRcentAlertAge
    );
  }, [
    todayAlertCount,
    yesterdayAlertCount,
    pastWeekAlertCount,
    pastMonthAlertCount,
    mostRcentAlertAge,
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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    Tracking.alarmAudioClick(isAudioOn);
    if (isAudioOn) {
      if (!alarm) {
        const alarm = new Audio(alarmAudio);
        alarm.addEventListener("canplaythrough", (event) => {
          setAlarm(alarm);
        });
      }
    }
  }, [isAudioOn]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <header className={isAlertMode ? "header alert-mode" : "header"}>
      <div className="header-top">
        <img className="logo" src={logo} alt="" />
        <h2>Real-time red alerts in Israel</h2>
      </div>
      <div className="header-content">
        {!isError && isAlertMode && (
          <AlertModeHeaderHero
            shouldRefresh={shouldRefresh}
            alert={realTimeAlert}
          />
        )}
        {!isError && !isAlertMode && (
          <HeaderHero
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
            {!isIphone() && (
              <AudioControls
                onAudioChange={(isAudioOn) => {
                  setIsAudioOn(isAudioOn);
                }}
                isAudioOn={isAudioOn}
              />
            )}
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
  mostRcentAlertAge: PropTypes.number,
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
