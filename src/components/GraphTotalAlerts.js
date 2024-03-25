import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import {
  getNow,
  dayOfMonthFormat,
  isBiWeeklyDifference,
  is3WeeksDifference,
  weekRangeFormat,
} from "../date_helper";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./withIsVisibleHook";
import Util from "../util";
import { LoadingOutlined } from "@ant-design/icons";

const GraphTotalAlerts = ({ alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);

  const config = {
    xField: "week",
    yField: "count",
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
        fontSize: 16,
      },
    },
    xAxis: {
      label: {
        autoHide: true,
        autoRotate: true,
        style: {
          fill: "black",
          fontSize: 14,
        },
      },
    },
    yAxis: false,
  };

  const buildGraph = useCallback(() => {
    let data = [];
    let biweeklyAlertCount = 0;
    let weekDate = new Date(2023, 9, 7);
    const weekDiffFunction = Util.isSmallViewport()
      ? is3WeeksDifference
      : isBiWeeklyDifference;

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (weekDiffFunction(weekDate, theDate)) {
        data.push({
          week: weekRangeFormat(weekDate, theDate),
          count: biweeklyAlertCount,
        });
        weekDate = theDate;
        biweeklyAlertCount = 0;
      }

      biweeklyAlertCount += alerts.length;
    });

    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getNow())}`,
      count: biweeklyAlertCount,
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
