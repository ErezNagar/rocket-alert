import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import Tile from "./Tile";
import withIsVisibleHook from "./withIsVisibleHook";
import Utilities from "../utilities/utilities";
import graphUtils from "./Graphs/graphUtils/graphUtils";
import { OPERATION_LIONS_ROAR } from "./Graphs/data/graphs";

const config = {
  isStack: true,
  xField: "date",
  yField: "alerts",
  seriesField: "origin",
  columnStyle: (item) =>
    item.origin === "Missiles - Iran"
      ? { radius: [20, 20, 0, 0] }
      : { radius: 0 },
  color: graphUtils.getColorByOrigin,
  appendPadding: Utilities.isSmallViewport()
    ? [30, 0, 0, 0]
    : [30, 100, 0, 100],
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

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    const data = OPERATION_LIONS_ROAR;
    setGraphData(data);
    setIsLoading(false);
    setShowGraph(true);
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
                subtitle={"Feb 28, 2026 - Apr 08, 2026"}
                fromDate={new Date("2026-02-28")}
                toDate={new Date("2026-04-08")}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_ROCKETS}
                showAverage
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"UAV Alerts"}
                subtitle={"Feb 28, 2026 - Apr 08, 2026"}
                fromDate={new Date("2026-02-28")}
                toDate={new Date("2026-04-08")}
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
            <div className="subtitle">Feb 28, 2026 - Apr 08, 2026</div>
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
