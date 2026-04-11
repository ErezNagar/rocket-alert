import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { Row, Col, Spin } from "antd";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./../withIsVisibleHook";
import Utilities from "../../utilities/utilities";
import { TOTAL_ALERTS, TOTAL_ALERTS_MOBILE } from "./data/graphs";
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

const GraphTotalAlerts = ({ isLoading, isError, isIntersectingRef }) => {
  const [data, setData] = useState(null);
  const [annotations, setAnnotations] = useState([]);

  const getWeeklyTotals = (data) => {
    const totals = {};
    for (const { week, alerts } of data) {
      totals[week] = (totals[week] || 0) + alerts;
    }

    return Object.entries(totals).map(([week, total]) => ({
      week,
      total,
    }));
  };

  const buildGraph = () => {
    const POSITION_OFFSET = 1 / 3;
    const POSITION_OFFSET_MOBILE = 1 / 2;
    const offset = Utilities.isSmallViewport()
      ? POSITION_OFFSET_MOBILE
      : POSITION_OFFSET;

    const data = Utilities.isSmallViewport()
      ? TOTAL_ALERTS_MOBILE
      : TOTAL_ALERTS;

    const totals = getWeeklyTotals(data);
    const annotations = totals.map((entry, i) => ({
      type: "text",
      position: [i - offset, entry.total + 400],
      content: `${entry.total}`,
      style: {
        fill: "black",
        fontSize: 14,
      },
    }));

    setData(data);
    setAnnotations(annotations);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    buildGraph();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section ref={isIntersectingRef} className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>Total rocket and UAV alerts</h2>
          <div className="subtitle">Oct 7, 2023 - Oct 10, 2025</div>
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
          {data && (
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
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(GraphTotalAlerts, "GraphTotalAlerts");
