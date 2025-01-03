import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import {
  getNow,
  isBiWeeklyDifference,
  weekRangeWithYearFormat,
  is5WeeksDifference,
} from "../date_helper";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./withIsVisibleHook";
import Util from "../util";
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

const GraphTotalUAVAlerts = ({ alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);

  const buildGraph = useCallback(() => {
    let data = [];
    let biweeklyAlertCount = 0;
    let weekDate = new Date(2023, 9, 7);
    const weekDiffFunction = Util.isSmallViewport()
      ? is5WeeksDifference
      : isBiWeeklyDifference;

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (weekDiffFunction(weekDate, theDate)) {
        data.push({
          week: weekRangeWithYearFormat(weekDate, theDate),
          alerts: biweeklyAlertCount,
        });
        weekDate = theDate;
        biweeklyAlertCount = 0;
      }

      biweeklyAlertCount += alerts.length;
    });

    data.push({
      week: weekRangeWithYearFormat(weekDate, getNow()),
      alerts: biweeklyAlertCount,
    });

    setData(data);
    setShowGraph(true);
  }, [alertData]);

  useEffect(() => {
    if (alertData) {
      buildGraph();
    }
  }, [alertData, buildGraph]);

  return (
    <section className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>UAV alerts since Oct 7</h2>
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

export default withIsVisibleHook(GraphTotalUAVAlerts, "Graph_total_uav_alerts");
