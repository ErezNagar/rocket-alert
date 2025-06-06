import React, { useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Spin } from "antd";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./../withIsVisibleHook";
import Utilities from "../../utilities/utilities";
import { TOTAL_ALERTS, TOTAL_ALERTS_MOBILE } from "./data/graphs";
import graphUtils from "./graphUtils/graphUtils";
import { LoadingOutlined } from "@ant-design/icons";

const config = {
  isStack: true,
  xField: "week",
  yField: "alerts",
  seriesField: "type",
  columnStyle: (item) =>
    item.type === "Rockets" ? { radius: [20, 20, 0, 0] } : { radius: 0 },
  color: ["#5c0011", "#be0023"],
  appendPadding: [30, 0, 0, 0],
  label: false,
  xAxis: {
    label: Utilities.buildxAxisLabel(),
  },
  yAxis: false,
  legend: false,
};

const GraphTotalAlerts = ({
  alertData,
  isLoading,
  isError,
  isIntersectingRef,
}) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  const buildGraph = () => {
    const POSITION_OFFSET = 1 / 3;
    const POSITION_OFFSET_MOBILE = 1 / 2;
    const offset = Utilities.isSmallViewport()
      ? POSITION_OFFSET_MOBILE
      : POSITION_OFFSET;

    const newData = graphUtils.buildNewData(alertData);
    const existingData = Utilities.isSmallViewport()
      ? TOTAL_ALERTS_MOBILE
      : TOTAL_ALERTS;
    const data = [...existingData, ...newData];

    const groupByWeek = (array, key) =>
      array.reduce((result, obj) => {
        const value = obj[key];
        if (!result[value]) {
          result[value] = [];
        }
        result[value].push(obj);
        return result;
      }, {});

    const grouped = groupByWeek(data, "week");
    const annotations = [];

    Object.keys(grouped).forEach((key, i) => {
      const totalValue = grouped[key].reduce((a, b) => a + b.alerts, 0);
      annotations.push({
        type: "text",
        position: [i - offset, totalValue + 400],
        content: `${totalValue}`,
        style: {
          fill: "black",
          fontSize: 14,
        },
      });
    });

    setData(data);
    setAnnotations(annotations);
    setShowGraph(true);
  };

  if (alertData && !showGraph) {
    buildGraph();
  }

  return (
    <section ref={isIntersectingRef} className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>Total rocket and UAV alerts since Oct 7</h2>
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
          {showGraph && (
            <Column
              {...{
                data,
                ...config,
                annotations,
              }}
            />
          )}
          {isError && (
            <div className="center-flexbox">
              <Col>Something went wrong. Please try again.</Col>
            </div>
          )}
        </Col>
      </Row>
    </section>
  );
};

GraphTotalAlerts.propTypes = {
  alertData: PropTypes.array,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};
GraphTotalAlerts.defaultProps = {
  alertData: [],
};

export default withIsVisibleHook(GraphTotalAlerts, "GraphTotalAlerts");
