import React, { useEffect, useState } from "react";
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

const Header = (props) => {
  const [headerText, setHeaderText] = useState({
    alertSummaryCount: 0,
    alertSummaryTitle: "",
    alertSummaryText: "",
  });
  const [twitterShareText, setTwitterShareText] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(false);
  const [alarm, setAlarm] = useState(null);

  /*
   * Queries the server to get alert data for the header alert summary.
     Fetches today's, yesterday's, past week's and past month's data, in local time.
   */
  const getHeaderData = () => {
    const alertClient = props.alertClient;
    const now = getNow();

    const startOfToday = getStartOfToday();
    const startOfYesterday = getStartOfYesterday();
    const endOfYesterday = getEndOfYesterday();
    const pastWeek = getPastWeek();
    const pastMonth = getPastMonth();

    Promise.all([
      alertClient.getTotalAlerts(startOfToday, now),
      alertClient.getTotalAlerts(
        startOfYesterday,
        endOfYesterday,
        Util.ALERT_TYPE_ALL
      ),
      alertClient.getTotalAlerts(pastWeek, now),
      alertClient.getTotalAlerts(pastMonth, now),
    ])
      .then((values) => {
        const todayAlertCount = values[0].success ? values[0].payload : 0;
        const yesterdayAlertCount = values[1].success ? values[1].payload : 0;
        const pastWeekAlertCount = values[2].success ? values[2].payload : 0;
        const pastMonthAlertCount = values[3].success ? values[3].payload : 0;

        setAlertSummary(
          todayAlertCount + props.realTimeAlertCache.count,
          yesterdayAlertCount,
          pastWeekAlertCount,
          pastMonthAlertCount
        );
      })
      .catch((error) => {
        Tracking.headerDataError(error);
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      });
  };

  /* Sets red alert summary text in a simple, human readable form.
   * Prioritizes recent alerts over old ones.
   */
  const setAlertSummary = async (
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
        alertSummaryText = `Yesterday, there were ${yesterdayAlertCount} red alerts`;
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
        alertSummaryText = `In the past week, there were ${pastWeekAlertCount} red alerts`;
        if (pastMonthAlertCount > 0) {
          alertSummaryText += `,\nand a total of ${pastMonthAlertCount} in the past month`;
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${pastMonthAlertCount} red alerts`;
      }
    } else if (yesterdayAlertCount > 0) {
      alertSummaryCount = yesterdayAlertCount;
      alertSummaryTitle = `Red alerts yesterday`;
      if (
        pastWeekAlertCount > 0 &&
        pastWeekAlertCount !== yesterdayAlertCount
      ) {
        alertSummaryText = `In the past week, there were ${pastWeekAlertCount} red alerts`;
        if (
          pastMonthAlertCount > 0 &&
          pastWeekAlertCount !== pastMonthAlertCount
        ) {
          alertSummaryText += `,\nand a total of ${pastMonthAlertCount} in the past month`;
        }
      } else if (pastMonthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${pastMonthAlertCount} red alerts`;
      }
    } else if (pastWeekAlertCount > 0) {
      alertSummaryCount = pastWeekAlertCount;
      alertSummaryTitle = `Red alerts in the past week`;
      if (
        pastMonthAlertCount > 0 &&
        pastMonthAlertCount !== pastWeekAlertCount
      ) {
        alertSummaryText += `In the past month, there were ${pastMonthAlertCount} red alerts`;
      }
    } else if (pastMonthAlertCount > 0) {
      alertSummaryCount = pastMonthAlertCount;
      alertSummaryTitle = `Red alerts in the last month`;
    } else {
      await props.alertClient
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

    const twitterShareText = `Red Alert in Israel: ${alertSummaryCount} ${alertSummaryTitle}. ${alertSummaryText}.`;
    setHeaderText({ alertSummaryCount, alertSummaryTitle, alertSummaryText });
    setTwitterShareText(twitterShareText);
    setIsLoading(false);
    props.onTwitterShareText(twitterShareText);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    getHeaderData();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    refreshAlert(props.realTimeAlert);
    if (props.isLastAlertOfBatch) {
      setHeaderText({
        ...headerText,
        alertSummaryCount: headerText.alertSummaryCount + 1,
      });
    }
  }, [props.realTimeAlert]);
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
    <header className={props.isAlertMode ? "header alert-mode" : "header"}>
      <div className="header-top">
        <img className="logo" src={logo} alt="" />
        <h2>Real-time red alerts in Israel</h2>
      </div>
      <div className="header-content">
        {!isError && props.isAlertMode && (
          <AlertModeHeaderContent
            shouldRefresh={shouldRefresh}
            alert={props.realTimeAlert}
          />
        )}
        {!isError && !props.isAlertMode && (
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
  alertClient: PropTypes.object.isRequired,
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.object,
  realTimeAlertCache: PropTypes.object.isRequired,
  onTwitterShareText: PropTypes.func.isRequired,
  isLastAlertOfBatch: PropTypes.bool.isRequired,
};

Header.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
};

export default Header;
