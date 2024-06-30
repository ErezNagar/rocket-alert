import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import {
  getNow,
  dayOfMonthFormat,
  isBiWeeklyDifference,
  weekRangeFormat,
  isIranianMissileAttackTimeFrame,
} from "../date_helper";
import { Column, Bar } from "@ant-design/plots";
import withIsVisibleHook from "./withIsVisibleHook";
import Util from "../util";
import { LoadingOutlined } from "@ant-design/icons";
import { withTranslation } from "react-i18next";

const GRAPH_CONFIG = {
  COLUMN: {
    xField: "week",
    yField: "count",
    isGroup: true,
    seriesField: "origin",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    height: 400,
    color: ["#008000", "#F7E210", "#DA0000", "#5c0011"],
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
    height: 900,
    legend: {
      layout: "vertical",
      position: "top-left",
    },
    autoFit: false,
    maxBarWidth: 40,
    minBarWidth: 13,
    color: ["#008000", "#F7E210", "#DA0000", "#5c0011"],
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

const GraphAlertsBySource = ({ t, alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [graphType, setGraphType] = useState("Column");
  const [config, setConfig] = useState(null);

  const buildGraph = useCallback(() => {
    let data = [];
    let originSouthCount = 0;
    let originNorthCount = 0;
    let originIranCount = 0;
    let weekDate = new Date(2023, 9, 7);

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (isBiWeeklyDifference(weekDate, theDate)) {
        const weekRange = weekRangeFormat(weekDate, theDate);
        data.push({
          week: weekRange,
          count: originSouthCount,
          origin: "Hamas (Gaza)",
        });
        data.push({
          week: weekRange,
          count: originNorthCount,
          origin: "Hezbollah (Southern Lebanon)",
        });
        if (originIranCount) {
          data.push({
            week: weekRange,
            count: originIranCount,
            origin: "Iran",
          });
        }
        weekDate = theDate;
        originSouthCount = 0;
        originNorthCount = 0;
        originIranCount = 0;
      }

      let originSouth = 0;
      let originNorth = 0;
      let originIran = 0;
      alerts.forEach((alert) => {
        if (isIranianMissileAttackTimeFrame(alert.timeStamp)) {
          originIran += 1;
        } else if (Util.isRegionInSouth(alert.areaNameEn)) {
          originSouth += 1;
        } else if (Util.isRegionInNorth(alert.areaNameEn)) {
          originNorth += 1;
        }
      });

      originSouthCount += originSouth;
      originNorthCount += originNorth;
      originIranCount += originIran;
    });

    const weekFormat = `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(
      getNow()
    )}`;
    data.push({
      week: weekFormat,
      count: originSouthCount,
      origin: "Hamas (Gaza)",
    });
    data.push({
      week: weekFormat,
      count: originNorthCount,
      origin: "Hezbollah (Southern Lebanon)",
    });
    data.push({
      week: weekFormat,
      count: originIranCount,
      origin: "Iran",
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
          <h2>{t("graph_alerts_by_source.title")}</h2>
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
                {t("graph_alerts_by_source.source_note")}
              </Col>
            </>
          )}
          {isError && (
            <div className="center-flexbox">
              <Col>{t("graph_alerts_by_source.error_message")}</Col>
            </div>
          )}
        </Col>
      </Row>
    </section>
  );
};

export default withIsVisibleHook(withTranslation()(GraphAlertsBySource), "Graph_alerts_by_source");
