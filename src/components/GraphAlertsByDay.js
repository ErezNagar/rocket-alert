import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { getYesterday, dayOfMonthFormat, isIranianMissileAttackTimeFrame } from "../date_helper";
import { Column, Bar } from "@ant-design/plots";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";
import Util from "../util";
import { LoadingOutlined } from "@ant-design/icons";
import { withTranslation } from "react-i18next";

const GRAPH_CONFIG = {
  COLUMN: {
    xField: "day",
    yField: "count",
    isGroup: true,
    seriesField: "origin",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    maxColumnWidth: 40,
    color: ["#008000", "#F7E210", "#DA0000", "#5c0011"],
    appendPadding: [30, 0, 0, 0],
    autoFit: true,
    label: {
      position: "top",
      autoHide: true,
      autoRotate: true,
      autoEllipsis: true,
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
    yField: "day",
    isGroup: true,
    seriesField: "origin",
    barStyle: {
      radius: [20, 20, 0, 0],
    },
    legend: {
      layout: "vertical",
      position: "top-left",
    },
    maxBarWidth: 40,
    minBarWidth: 13,
    color: ["#008000", "#F7E210", "#DA0000", "#5c0011"],
    appendPadding: [0, 50, 0, 0],
    dodgePadding: 4,
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

const GraphAlertsByDay = ({ t, alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [selectedMonthData, setSelectedMonthData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [graphType, setGraphType] = useState("Column");
  const [config, setConfig] = useState(null);

  const buildGraph = useCallback(() => {
    let dataIndex = 0;
    const data = { months: [] };

    const datesInterval = eachDayOfInterval({
      start: new Date("2023-10-07T00:00"),
      end: getYesterday(),
    });

    datesInterval.forEach((dateInterval) => {
      const monthName = dateInterval.toLocaleString("default", {
        month: "long",
      });
      if (!data.months.includes(monthName)) {
        data.months.push(monthName);
        data[monthName] = [];
      }

      if (dataIndex >= alertData.length) {
        data[monthName].push({ day: dayOfMonthFormat(dateInterval), count: 0 });
      } else {
        const [year, month, day] = alertData[dataIndex].date.split("-");
        const dateOfAlerts = new Date(year, month - 1, day);

        let originSouthCount = 0;
        let originNorthCount = 0;
        let originIranCount = 0;
        alertData[dataIndex].alerts.forEach((alert) => {
          if (isIranianMissileAttackTimeFrame(alert.timeStamp)) {
            originIranCount += 1;
          } else if (Util.isRegionInSouth(alert.areaNameEn)) {
            originSouthCount += 1;
          } else if (Util.isRegionInNorth(alert.areaNameEn)) {
            originNorthCount += 1;
          }
        });

        data[monthName].push({
          day: dayOfMonthFormat(dateInterval),
          count: isSameDay(dateInterval, dateOfAlerts) ? originSouthCount : 0,
          origin: "Hamas (Gaza)",
        });
        data[monthName].push({
          day: dayOfMonthFormat(dateInterval),
          count: isSameDay(dateInterval, dateOfAlerts) ? originNorthCount : 0,
          origin: "Hezbollah (Southern Lebanon)",
        });
        if (originIranCount) {
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: originIranCount,
            origin: "Iran",
          });
        }

        if (isSameDay(dateInterval, dateOfAlerts)) {
          dataIndex = dataIndex + 1;
        }
      }
    });

    const selectedMonth = data.months[data.months.length - 1];

    setData(data);
    setSelectedMonth(selectedMonth);
    setSelectedMonthData(data[selectedMonth]);
  }, [alertData]);

  const updateGraphConfig = useCallback(() => {
    const type = Util.isMediumViewport() ? "Bar" : "Column";
    let height = 200;

    if (type === "Bar") {
      if (selectedMonthData.length <= 10) {
        height = 200;
      } else if (selectedMonthData.length <= 20) {
        height = 400;
      } else if (selectedMonthData.length <= 40) {
        height = 800;
      } else {
        height = 1300;
      }
    }

    setShowGraph(false);
    setConfig(null);
    setTimeout(() => {
      setGraphType(type);
      setConfig({
        ...(type === "Column" ? GRAPH_CONFIG.COLUMN : GRAPH_CONFIG.BAR),
        height: type === "Column" ? 400 : height,
      });
      setShowGraph(true);
    }, 1);
  }, [selectedMonthData]);

  useEffect(() => {
    if (alertData) {
      buildGraph();
    }
  }, [alertData, buildGraph]);

  useEffect(() => {
    if (selectedMonth) {
      updateGraphConfig();
    }
  }, [selectedMonth, updateGraphConfig]);

  const handleMonthClick = () => {
    const month = document.getElementById("month-select").value;
    Tracking.graphMonthClick(month);
    setSelectedMonth(month);
    setSelectedMonthData(data[month]);
  };

  return (
    <section className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>{t("graph_alerts_by_day.title")}</h2>
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
              <Row justify={"center"}>
                <div className={"customSelect"}>
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => handleMonthClick(e)}
                  >
                    {data.months.map((month) => (
                      <option value={month} key={month}>
                        {t(`graph_alerts_by_day.month.${month.toLowerCase()}`)}
                      </option>
                    ))}
                  </select>
                </div>
              </Row>
              {graphType === "Column" && (
                <Column {...{ ...config, data: selectedMonthData }} />
              )}
              {graphType === "Bar" && (
                <Bar {...{ ...config, data: selectedMonthData }} />
              )}
              <Col className="footer">
                {t("graph_alerts_by_day.source_note")}
              </Col>
            </>
          )}
          {isError && (
            <div className="center-flexbox">
              <Col>{t("graph_alerts_by_day.error_message")}</Col>
            </div>
          )}
        </Col>
      </Row>
    </section>
  );
};

export default withIsVisibleHook(withTranslation()(GraphAlertsByDay), "Graph_alerts_by_day");
