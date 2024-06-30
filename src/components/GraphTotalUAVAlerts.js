import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import {
  getNow,
  dayOfMonthFormat,
  isBiWeeklyDifference,
  weekRangeFormat,
  isAMonthDifference,
} from "../date_helper";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./withIsVisibleHook";
import Util from "../util";
import { LoadingOutlined } from "@ant-design/icons";
import { withTranslation } from "react-i18next";

const GraphTotalUAVAlerts = ({ alertData, isLoading, isError, t }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);

  const config = {
    xField: "week",
    yField: "count",
    seriesField: "",
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
      ? isAMonthDifference
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
          <h2>{t("uav_alerts_since_oct_7")}</h2>
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
              <Col>{t("something_went_wrong")}</Col>
            </div>
          )}
        </Col>
      </Row>
    </section>
  );
};

export default withTranslation()(withIsVisibleHook(GraphTotalUAVAlerts, "Graph_total_uav_alerts"));
