import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import {
  getNow,
  dayOfMonthFormat,
  isBiWeeklyDifference,
  weekRangeFormat,
} from "../date_helper";
import { Column, Bar } from "@ant-design/plots";
import withIsVisibleHook from "./withIsVisibleHook";
import Util from "../util";
import { LoadingOutlined } from "@ant-design/icons";

const GRAPH_CONFIG = {
  COLUMN: {
    xField: "week",
    yField: "count",
    isGroup: true,
    seriesField: "origin",
    // columnWidthRatio: 0.5,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    height: 400,
    color: ["#008000", "#F7E210", "#5c0011"],
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
    legend: {
      layout: "horizontal",
      position: "top",
    },
  },
  BAR: {
    xField: "count",
    yField: "week",
    isGroup: true,
    seriesField: "origin",
    barStyle: {
      radius: [20, 20, 0, 0],
    },
    height: 550,
    legend: {
      layout: "horizontal",
      position: "top-left",
    },
    autoFit: false,
    maxBarWidth: 40,
    minBarWidth: 13,
    color: ["#008000", "#F7E210", "#5c0011"],
    appendPadding: [0, 50, 0, 0],
    dodgePadding: 4,
    intervalPadding: 15,
    label: {
      position: "right",
      autoHide: true,
      autoRotate: true,
      autoEllipsis: true,
      style: {
        fill: "black",
        opacity: 1,
        fontSize: 14,
      },
    },
    yAxis: {
      label: {
        autoHide: false,
        autoRotate: true,
        style: {
          fill: "black",
          fontSize: 14,
        },
      },
    },
    xAxis: false,
  },
};

const GraphAlertBySource = ({ alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [graphType, setGraphType] = useState("Column");
  const [config, setConfig] = useState(null);

  const buildGraph = useCallback(() => {
    let data = [];
    let originSouthCount = 0;
    let originNorthCount = 0;
    let weekDate = new Date(2023, 9, 7);

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (isBiWeeklyDifference(weekDate, theDate)) {
        data.push({
          week: weekRangeFormat(weekDate, theDate),
          count: originSouthCount,
          origin: "Hamas (Gaza)",
        });
        data.push({
          week: weekRangeFormat(weekDate, theDate),
          count: originNorthCount,
          origin: "Hezbollah (Southern Lebanon)",
        });
        weekDate = theDate;
        originSouthCount = 0;
        originNorthCount = 0;
      }

      let originSouth = 0;
      let originNorth = 0;
      alerts.forEach((alert) => {
        if (Util.isRegionInSouth(alert.areaNameEn)) {
          originSouth += 1;
        } else if (Util.isRegionInNorth(alert.areaNameEn)) {
          originNorth += 1;
        }
      });

      originSouthCount += originSouth;
      originNorthCount += originNorth;
    });

    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getNow())}`,
      count: originSouthCount,
      origin: "Hamas (Gaza)",
    });
    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getNow())}`,
      count: originNorthCount,
      origin: "Hezbollah (Southern Lebanon)",
    });

    setData(data);
  }, [alertData]);

  const updateGraphConfig = () => {
    const type = Util.isSmallViewport() ? "Bar" : "Column";
    setGraphType(type);
    setConfig({
      ...(type === "Column" ? GRAPH_CONFIG.COLUMN : GRAPH_CONFIG.BAR),
    });
    setShowGraph(true);
  };

  useEffect(() => {
    if (alertData) {
      buildGraph();
    }
  }, [alertData, buildGraph]);

  useEffect(() => {
    if (data) {
      updateGraphConfig();
    }
  }, [data]);

  return (
    <section className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>Alerts by source since Oct 7</h2>
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
            <>
              <Col>
                {graphType === "Column" && (
                  <Column
                    {...{
                      data,
                      ...config,
                    }}
                  />
                )}
                {graphType === "Bar" && (
                  <Bar
                    {...{
                      data,
                      ...config,
                    }}
                  />
                )}
              </Col>
              <Col className="footer">
                Source is estimation only. Based on alert location and its
                distance from the Gaza Strip vs Southern Lebanon. May or may not
                include rockets fired by Islamic Jihad (Gaza) or by other
                Iranian proxies (Southern Lebanon)
              </Col>
            </>
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

export default withIsVisibleHook(GraphAlertBySource, "Graph_alerts_by_source");
