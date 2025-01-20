import React, { useState } from "react";
import { Row, Col, Spin } from "antd";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./../withIsVisibleHook";
import Util from "../../util";
import { TOTAL_ALERTS } from "../../graphUtils/precompiledGraphData";
import graphUtils from "../../graphUtils/graphUtils";
import { LoadingOutlined } from "@ant-design/icons";

const config = {
  xField: "week",
  yField: "alerts",
  seriesField: "",
  // columnWidthRatio: 0.5,
  columnStyle: {
    radius: [20, 20, 0, 0],
  },
  color: "#5c0011",
  appendPadding: [30, 0, 0, 0],
  label: {
    position: "top",
    style: {
      fill: "black",
      opacity: 1,
      fontSize: 14,
    },
  },
  xAxis: {
    label: Util.buildxAxisLabel(),
  },
  yAxis: false,
};

const GraphTotalAlerts = ({ alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);

  const buildGraph = () => {
    const data = graphUtils.buildNewGraphData(alertData);
    const concatData = graphUtils.concatGraphData(TOTAL_ALERTS, data);
    setData(concatData);
    setShowGraph(true);
  };

  if (alertData && !showGraph) {
    buildGraph();
  }

  return (
    <section className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>Total alerts since Oct 7</h2>
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

export default withIsVisibleHook(GraphTotalAlerts, "Graph_total_alerts");
