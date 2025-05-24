import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { differenceInDays } from "date-fns";
import { Row, Col, Statistic, Spin } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import FadeIn from "./FadeIn";
import Tracking from "../tracking";
import Utilities from "../utilities/utilities";
import Sparkline from "./Sparkline";

const LoadingSparkline = () => (
  <Row justify="center" style={{ padding: "1.175em 0" }}>
    <Col>
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 24, color: "black" }} spin />
        }
      />
    </Col>
  </Row>
);

const LoadingTile = ({ showAverage }) => (
  <Row
    gutter={[8]}
    justify="center"
    className={showAverage ? "loading-average" : "loading-basic"}
  >
    <Col>
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 24, color: "black" }} spin />
        }
      />
    </Col>
  </Row>
);

LoadingTile.propTypes = {
  showAverage: PropTypes.bool,
};
LoadingTile.defaultProps = {
  showAverage: false,
};

const Tile = ({
  title,
  subtitle,
  fromDate,
  toDate,
  alertsClient,
  showAverage,
  sparklineData: propsSparklineData,
  isStatic,
  alertCount,
  alertTypeId,
}) => {
  const [alerts, setAlerts] = useState();
  const [average, setAverage] = useState(0);
  const [sparklineData, setSparklineData] = useState([]);
  const [isSparklineLoading, setIsSparkineLoading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const getAlerts = () => {
    alertsClient
      .getTotalAlerts(fromDate, toDate, alertTypeId)
      .then((res) => {
        if (showAverage) {
          setAverage(getAverage(res.payload));
        }
        setAlerts(res.payload);
        setIsLoading(false);
      })
      .catch((error) => {
        Tracking.tileError(error);
        console.error(error);
        setIsError(true);
        setIsLoading(false);
      });
  };

  const getDailyAlerts = () => {
    setIsSparkineLoading(true);
    alertsClient
      .getTotalAlertsByDay(fromDate, toDate, alertTypeId)
      .then((res) => {
        const data = res.payload.map((date) => date.alerts);
        if (alertTypeId === Utilities.ALERT_TYPE_ROCKETS) {
          const sparklineData = [];
          let count = 0;
          for (let i = 0; i < data.length; i++) {
            if ((i + 1) % 9 === 0) {
              sparklineData.push(count);
              count = 0;
            }
            count += data[i];
          }
          sparklineData.push(count);
          setSparklineData(sparklineData);
          setIsSparkineLoading(false);
        }
        if (alertTypeId === Utilities.ALERT_TYPE_UAV) {
          const sparklineData = data
            .filter((_, idx) => (idx + 1) % 2 !== 0)
            .filter((_, idx) => (idx + 1) % 2 !== 0)
            .filter((_, idx) => (idx + 1) % 2 !== 0);
          setSparklineData(sparklineData);
          setIsSparkineLoading(false);
        }
      })
      .catch((error) => {
        Tracking.tileError(error);
        console.error(error);
        setIsSparkineLoading(false);
        setIsError(true);
      });
  };

  const getAverage = (total) => {
    const dayCount = differenceInDays(new Date(toDate), new Date(fromDate));
    return Math.round(total / dayCount);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (isStatic) {
      setAlerts(alertCount);
      setIsLoading(false);
      setAverage(showAverage ? getAverage(alertCount) : 0);
    } else {
      getAlerts();
      getDailyAlerts();
    }
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  const hasData = !isLoading && !isError;

  return (
    <div className="tile">
      <h3>{title}</h3>
      <div className="subtitle">{subtitle}</div>
      <div>
        {isLoading && <LoadingTile showAverage />}
        {hasData && showAverage && (
          <Row gutter={[8]} justify="center" className="average-container">
            <Col>
              <div className="alerts">
                <FadeIn show={!isLoading}>
                  <Statistic value={alerts} />
                </FadeIn>
              </div>
              <div>Total</div>
            </Col>
            <Col className="separator">.</Col>
            <Col>
              <div className="average">
                <FadeIn show={!isLoading}>
                  <Statistic value={average} />
                </FadeIn>
              </div>
              <div>Avg/Day</div>
            </Col>
          </Row>
        )}
        {hasData && !showAverage && (
          <div className="alerts">
            <FadeIn show={!isLoading}>
              <Statistic value={alerts} />
            </FadeIn>
          </div>
        )}
        {isError && (
          <FadeIn show={!isLoading}>
            <ExclamationCircleOutlined
              className={showAverage ? "loading-average" : "loading-basic"}
            />
            {" Data unavailable"}
          </FadeIn>
        )}
        {isSparklineLoading && <LoadingSparkline />}
        {!isSparklineLoading && (propsSparklineData || sparklineData) && (
          <Sparkline
            id={title}
            width={250}
            height={50}
            data={propsSparklineData || sparklineData}
          />
        )}
      </div>
    </div>
  );
};

Tile.propTypes = {
  title: PropTypes.string,
  subtitle: PropTypes.string,
  fromDate: PropTypes.instanceOf(Date),
  toDate: PropTypes.instanceOf(Date),
  alertsClient: PropTypes.object,
  sparklineData: PropTypes.array,
  showAverage: PropTypes.bool,
  // "Static" tile uses alertCount instead of making a request to the server
  isStatic: PropTypes.bool,
  alertCount: PropTypes.number,
  alertTypeId: PropTypes.number,
};
Tile.defaultProps = {
  title: "",
  subtitle: "",
  toDate: new Date(),
  alertsClient: {},
  showAverage: false,
  isStatic: false,
  alertCount: 0,
  alertTypeId: Utilities.ALERT_TYPE_ROCKETS,
};

export default Tile;
