import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { dayOfMonthFormat } from "../utilities/date_helper";
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
    ? [30, 50, 0, 50]
    : [30, 500, 0, 500],
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
  // const [annotations, setAnnotations] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const buildNewData = (alertData) => {
    let data = [];

    // data.push({
    //   date: "2/28",
    //   alerts: 4175,
    //   type: "Rockets",
    // });
    // data.push({
    //   date: "2/28",
    //   alerts: 97,
    //   type: "UAVs",
    // });
    // data.push({
    //   date: "3/1",
    //   alerts: 16521,
    //   type: "Rockets",
    // });
    // data.push({
    //   date: "3/1",
    //   alerts: 388,
    //   type: "UAVs",
    // });
    // data.push({
    //   date: "3/2",
    //   alerts: 8679,
    //   type: "Rockets",
    // });
    // data.push({
    //   date: "3/2",
    //   alerts: 128,
    //   type: "UAVs",
    // });
    // data.push({
    //   date: "3/3",
    //   alerts: 4675,
    //   type: "Rockets",
    // });
    // data.push({
    //   date: "3/3",
    //   alerts: 863,
    //   type: "UAVs",
    // });
    // data.push({
    //   date: "3/4",
    //   alerts: 2913,
    //   type: "Rockets",
    // });
    // data.push({
    //   date: "3/4",
    //   alerts: 218,
    //   type: "UAVs",
    // });

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const alertDate = new Date(year, month - 1, day);
      const rocketAlerts = alerts.filter(
        (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_ROCKETS,
      );
      const UAVAlerts = alerts.filter(
        (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_UAV,
      );

      data.push({
        date: dayOfMonthFormat(alertDate),
        alerts: rocketAlerts.length,
        type: "Rockets",
      });
      data.push({
        date: dayOfMonthFormat(alertDate),
        alerts: UAVAlerts.length,
        type: "UAVs",
      });
    });

    return data;
  };

  const buildGraph = (payload) => {
    // const POSITION_OFFSET = 1 / 3;
    // const POSITION_OFFSET_MOBILE = 1 / 2;
    // const offset = Utilities.isSmallViewport()
    //   ? POSITION_OFFSET_MOBILE
    //   : POSITION_OFFSET;

    const data = buildNewData(payload);

    // const annotations = [];

    // data.forEach((alertDate, i) => {
    //   console.log(".alerts", alertDate.alerts);
    //   //   const totalValue = data[key].reduce((a, b) => a + b.alerts, 0);
    //   annotations.push({
    //     type: "text",
    //     position: [i - offset, alertDate.alerts + 400],
    //     content: `${alertDate.alerts}`,
    //     style: {
    //       fill: "black",
    //       fontSize: 14,
    //     },
    //   });
    // });

    setGraphData(data);
    setIsLoading(false);
    // setAnnotations(annotations);
    setShowGraph(true);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    alertsClient
      .getDetailedAlerts(new Date("2026-02-28"), new Date(getNow()))
      .then((res) => {
        buildGraph(res.payload);
      })
      .catch(() => {
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
            Some days have missing data due to technical issues with alert
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
