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

  const buildNewData = (alertData) => {
    let data = [];

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

    setGraphData(data);
    setIsLoading(false);
    setShowGraph(true);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    alertsClient
      .getDetailedAlerts(new Date("2026-02-28"), new Date(getNow()))
      .then((res) => {
        buildGraph(res.payload);
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
