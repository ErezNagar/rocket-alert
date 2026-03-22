import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import {
  dayOfMonthFormat,
  convertToServerTime,
  getTwoDaysAgo,
} from "../utilities/date_helper";
import Tile from "./Tile";
import withIsVisibleHook from "./withIsVisibleHook";
import Utilities from "../utilities/utilities";
import { getNow } from "../utilities/date_helper";

const config = {
  isStack: true,
  xField: "date",
  yField: "alerts",
  seriesField: "type",
  columnStyle: (item) =>
    item.type === "Rockets" ? { radius: [20, 20, 0, 0] } : { radius: 0 },
  color: ["#DA0000", "#5c0011"],
  appendPadding: Utilities.isSmallViewport()
    ? [30, 0, 0, 0]
    : [30, 200, 0, 200],
  label: false,
  xAxis: {
    label: {
      style: {
        fill: "black",
        fontSize: 14,
      },
    },
  },
  yAxis: false,
  legend: false,
};

const OperationLionsRoar = ({ alertsClient, isIntersectingRef }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  // const buildNewData = (alertData) => {
  //   let data = [];

  //   alertData.forEach(({ alerts, date }) => {
  //     const [year, month, day] = date.split("-");
  //     const alertDate = new Date(year, month - 1, day);
  //     const rocketAlerts = alerts.filter(
  //       (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_ROCKETS,
  //     );
  //     const UAVAlerts = alerts.filter(
  //       (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_UAV,
  //     );

  //     data.push({
  //       date: dayOfMonthFormat(alertDate),
  //       alerts: rocketAlerts.length,
  //       type: "Rockets",
  //     });
  //     data.push({
  //       date: dayOfMonthFormat(alertDate),
  //       alerts: UAVAlerts.length,
  //       type: "UAVs",
  //     });
  //   });

  //   return data;
  // };

  const buildNewDataFallback = (recentData) => {
    const rockets = [
      // { date: "2026-03-21", alerts: 548 },
      // { date: "2026-03-20", alerts: 2370 },
      { date: "2026-03-19", alerts: 2745 },
      { date: "2026-03-18", alerts: 1151 },
      { date: "2026-03-17", alerts: 3112 },
      { date: "2026-03-16", alerts: 3518 },
      { date: "2026-03-15", alerts: 1537 },
      { date: "2026-03-14", alerts: 1098 },
      { date: "2026-03-13", alerts: 1522 },
      { date: "2026-03-12", alerts: 1387 },
      { date: "2026-03-11", alerts: 1840 },
      { date: "2026-03-09", alerts: 280 },
      { date: "2026-03-08", alerts: 2620 },
      { date: "2026-03-07", alerts: 2806 },
      { date: "2026-03-06", alerts: 1386 },
      { date: "2026-03-05", alerts: 1986 },
      { date: "2026-03-04", alerts: 1210 },
      { date: "2026-03-03", alerts: 2187 },
      { date: "2026-03-02", alerts: 4126 },
      { date: "2026-03-01", alerts: 8158 },
      { date: "2026-02-28", alerts: 14073 },
    ];
    const UAVs = [
      // { date: "2026-03-21", alerts: 25 },
      // { date: "2026-03-20", alerts: 82 },
      { date: "2026-03-19", alerts: 30 },
      { date: "2026-03-18", alerts: 69 },
      { date: "2026-03-17", alerts: 274 },
      { date: "2026-03-16", alerts: 105 },
      { date: "2026-03-15", alerts: 56 },
      { date: "2026-03-14", alerts: 132 },
      { date: "2026-03-13", alerts: 56 },
      { date: "2026-03-12", alerts: 97 },
      { date: "2026-03-11", alerts: 291 },
      { date: "2026-03-08", alerts: 210 },
      { date: "2026-03-07", alerts: 91 },
      { date: "2026-03-06", alerts: 275 },
      { date: "2026-03-05", alerts: 127 },
      { date: "2026-03-04", alerts: 131 },
      { date: "2026-03-03", alerts: 349 },
      { date: "2026-03-02", alerts: 105 },
      { date: "2026-03-01", alerts: 214 },
      { date: "2026-02-28", alerts: 62 },
    ];
    let data = [];

    [...recentData.rockets, ...rockets].reverse().forEach((date) => {
      data.push({
        date: dayOfMonthFormat(convertToServerTime(new Date(date.date))),
        alerts: date.alerts,
        type: "Rockets",
      });
    });

    [...recentData.UAVs, ...UAVs].reverse().forEach((date) => {
      data.push({
        date: dayOfMonthFormat(convertToServerTime(new Date(date.date))),
        alerts: date.alerts,
        type: "UAVs",
      });
    });

    return data;
  };

  // const buildGraph = (payload) => {
  //   // const POSITION_OFFSET = 1 / 3;
  //   // const POSITION_OFFSET_MOBILE = 1 / 2;
  //   // const offset = Utilities.isSmallViewport()
  //   //   ? POSITION_OFFSET_MOBILE
  //   //   : POSITION_OFFSET;

  //   const data = buildNewData(payload);

  //   setGraphData(data);
  //   setIsLoading(false);
  //   // setAnnotations(annotations);
  //   setShowGraph(true);
  // };

  const buildGraphFallback = (payload) => {
    const rawData = payload.map((item) => ({
      date: item.timestamp,
      alerts: item.cities.length,
      type: item.type,
    }));

    const rawRockets = rawData.filter((item) => item.type === "missiles");
    const rawUAVs = rawData.filter(
      (item) => item.type === "hostileAircraftIntrusion",
    );

    const rockets = Object.values(
      rawRockets.reduce((acc, { date, alerts, type }) => {
        const day = date.split("T")[0]; // extract YYYY-MM-DD
        if (!acc[day]) {
          acc[day] = { date: day, alerts: 0 };
        }

        acc[day].alerts += alerts;
        return acc;
      }, {}),
    );

    const UAVs = Object.values(
      rawUAVs.reduce((acc, { date, alerts, type }) => {
        const day = date.split("T")[0];
        if (!acc[day]) {
          acc[day] = { date: day, alerts: 0 };
        }

        acc[day].alerts += alerts;
        return acc;
      }, {}),
    );

    const data = buildNewDataFallback({ rockets, UAVs });
    setGraphData(data);
    setIsLoading(false);
    setShowGraph(true);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    alertsClient
      // .getDetailedAlerts(new Date("2026-02-28"), new Date(getNow()))
      .getDetailedAlertsFallback(new Date("2026-03-20"), getTwoDaysAgo())
      .then((res) => {
        // buildGraph(res.payload);
        buildGraphFallback(res.payload);
      })
      .catch((res) => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section className="current-operation">
      <div
        ref={isIntersectingRef}
        className="currentOperationTilesContainer newest"
      >
        <div className="currentOperationTile">
          <h2>Operation Lion's Roar</h2>
          <div className="subtitle">Joint Israel & US attack on Iran</div>
          <Row gutter={[24, 24]} justify={"center"}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Rocket Alerts"}
                subtitle={"Since February 28, 2026"}
                fromDate={new Date("2026-02-28")}
                toDate={new Date(getNow())}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_ROCKETS}
                shouldShowSparkline={false}
                showAverage
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"UAV Alerts"}
                subtitle={"Since February 28, 2026"}
                fromDate={new Date("2026-02-28")}
                toDate={new Date(getNow())}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_UAV}
                shouldShowSparkline={false}
                showAverage
              />
            </Col>
          </Row>
        </div>
      </div>
      <section ref={isIntersectingRef} className="graph">
        <Row justify={"center"}>
          <Col span={24}>
            <h2>Total rocket and UAV alerts</h2>
            <div className="subtitle">Since February 28, 2026</div>
            {isLoading && (
              <div className="center-flexbox">
                <Spin
                  indicator={
                    <LoadingOutlined
                      style={{ fontSize: 24, color: "black" }}
                      spin
                    />
                  }
                />
              </div>
            )}
            {showGraph && <Column {...{ ...config, data: graphData }} />}
            {isError && (
              <div className="center-flexbox">
                <Col>Something went wrong. Please try again.</Col>
              </div>
            )}
          </Col>
          <Col className="footer">
            Some days may have missing data due to technical issues with alert
            collection.
          </Col>
        </Row>
      </section>
    </section>
  );
};

OperationLionsRoar.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(OperationLionsRoar, "OperationLionsRoar");
