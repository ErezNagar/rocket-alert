import React, { useEffect, useState, useCallback } from "react";
import { Row, Col, Spin } from "antd";
import { eachDayOfInterval, isSameDay } from "date-fns";
import {
  getYesterday,
  dayOfMonthFormat,
  isIranianMissileAttackTimeFrame,
  isYemenMissileAttackTimeFrame,
  isAfterCeaseFireInTheNorth,
  isConfirmedFalseAlert,
} from "../../date_helper";
import { Column, Bar } from "@ant-design/plots";
import Tracking from "../../tracking";
import withIsVisibleHook from "./../withIsVisibleHook";
import Util from "../../util";
import { ALERTS_BY_DAY } from "../../graphUtils/precompiledGraphData";
import graphUtils from "../../graphUtils/graphUtils";
import { LoadingOutlined } from "@ant-design/icons";

const GRAPH_CONFIG = {
  COLUMN: {
    xField: "day",
    yField: "alerts",
    isGroup: true,
    seriesField: "origin",
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    maxColumnWidth: 40,
    color: graphUtils.getColorByOrigin,
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
    xField: "alerts",
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
    color: graphUtils.getColorByOrigin,
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

// The date from which the graph date interval will start
const BEGINNING_DATE_INTERVAL = new Date("2025-01-01T00:00");

const GraphAlertsByDay = ({ alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedData, setSelectedMonthData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [graphType, setGraphType] = useState("Column");
  const [config, setConfig] = useState(null);

  /*
    Returns whether there are alerts for that date
  */
  const isDateWithAlerts = (date, alertData) => {
    const [year, month, day] = alertData.date.split("-");
    const dateOfAlerts = new Date(year, month - 1, day);
    return isSameDay(date, dateOfAlerts);
  };

  const buildGraph = useCallback(() => {
    let alertDataIdx = 0;
    const data = { years: [] };

    const dates = eachDayOfInterval({
      start: BEGINNING_DATE_INTERVAL,
      end: getYesterday(),
    });

    dates.forEach((date) => {
      const year = date.toLocaleString("default", {
        year: "numeric",
      });
      const monthName = date.toLocaleString("default", {
        month: "long",
      });
      if (!data.years.includes(year)) {
        data.years.push(year);
        data[year] = { months: [] };
      }
      if (!data[year].months.includes(monthName)) {
        data[year].months.push(monthName);
        data[year][monthName] = [];
      }

      if (alertDataIdx >= alertData.length) {
        data[year][monthName].push({
          day: dayOfMonthFormat(date),
          alerts: 0,
          origin: graphUtils.ALERT_SOURCE.HAMAS.LABEL,
        });
        data[year][monthName].push({
          day: dayOfMonthFormat(date),
          alerts: 0,
          origin: graphUtils.ALERT_SOURCE.HEZBOLLAH.LABEL,
        });
      } else {
        const [year] = alertData[alertDataIdx].date.split("-");

        // If date has alerts, go over the alerts and categorize them by source
        if (isDateWithAlerts(date, alertData[alertDataIdx])) {
          let originSouthCount = 0;
          let originNorthCount = 0;
          let originIranCount = 0;
          let originYemenCount = 0;

          alertData[alertDataIdx].alerts.forEach((alert) => {
            if (isConfirmedFalseAlert(alert.timeStamp)) {
              return;
            } else if (isIranianMissileAttackTimeFrame(alert.timeStamp)) {
              originIranCount += 1;
            } else if (isYemenMissileAttackTimeFrame(alert.timeStamp)) {
              originYemenCount += 1;
            } else if (isAfterCeaseFireInTheNorth(alert.timeStamp)) {
              originSouthCount += 1;
            } else if (Util.isRegionInSouth(alert.areaNameEn)) {
              originSouthCount += 1;
            } else if (Util.isRegionInNorth(alert.areaNameEn)) {
              originNorthCount += 1;
            }
          });

          data[year][monthName].push({
            day: dayOfMonthFormat(date),
            alerts: originSouthCount,
            origin: graphUtils.ALERT_SOURCE.HAMAS.LABEL,
          });
          data[year][monthName].push({
            day: dayOfMonthFormat(date),
            alerts: originNorthCount,
            origin: graphUtils.ALERT_SOURCE.HEZBOLLAH.LABEL,
          });
          if (originIranCount) {
            data[year][monthName].push({
              day: dayOfMonthFormat(date),
              alerts: originIranCount,
              origin: graphUtils.ALERT_SOURCE.IRAN.LABEL,
            });
          }
          if (originYemenCount) {
            data[year][monthName].push({
              day: dayOfMonthFormat(date),
              alerts: originYemenCount,
              origin: graphUtils.ALERT_SOURCE.HOUTHIS.LABEL,
            });
          }

          alertDataIdx += 1;
        } else {
          // If date doesn't have alerts, add 0 to each source

          data[year][monthName].push({
            day: dayOfMonthFormat(date),
            alerts: 0,
            origin: graphUtils.ALERT_SOURCE.HAMAS.LABEL,
          });
          data[year][monthName].push({
            day: dayOfMonthFormat(date),
            alerts: 0,
            origin: graphUtils.ALERT_SOURCE.HEZBOLLAH.LABEL,
          });
        }
      }
    });

    const selectedYear = data.years[data.years.length - 1];
    const selectedMonth =
      data[selectedYear].months[data[selectedYear].months.length - 1];

    setData(graphUtils.concatAlertsByDayGraphData(ALERTS_BY_DAY, data));
    setSelectedYear(selectedYear);
    setSelectedMonth(selectedMonth);
    setSelectedMonthData(data[selectedYear][selectedMonth]);
  }, [alertData]);

  const updateGraphConfig = useCallback(() => {
    const type = Util.isMediumViewport() ? "Bar" : "Column";
    let height = 200;

    if (type === "Bar") {
      if (selectedData.length <= 10) {
        height = 200;
      } else if (selectedData.length <= 20) {
        height = 400;
      } else if (selectedData.length <= 40) {
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
  }, [selectedData]);

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

  const handleYearClick = () => {
    const year = document.getElementById("year-select").value;
    Tracking.graphYearClick(year);

    if (data[year].months.includes(selectedMonth)) {
      setSelectedMonthData(data[year][selectedMonth]);
    } else {
      const month = data[year].months[data[year].months.length - 1];
      setSelectedMonth(month);
      setSelectedMonthData(data[year][month]);
    }
    setSelectedYear(year);
  };

  const handleMonthClick = () => {
    const month = document.getElementById("month-select").value;
    Tracking.graphMonthClick(month);
    setSelectedMonth(month);
    setSelectedMonthData(data[selectedYear][month]);
  };

  return (
    <section className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>Alerts by day since Oct 7</h2>
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
                    id="year-select"
                    value={selectedYear}
                    onChange={(e) => handleYearClick(e)}
                  >
                    {data.years.map((year) => (
                      <option value={year} key={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
                <div className={"customSelect"}>
                  <select
                    id="month-select"
                    value={selectedMonth}
                    onChange={(e) => handleMonthClick(e)}
                  >
                    {data[selectedYear].months.map((month) => (
                      <option value={month} key={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </Row>
              {graphType === "Column" && (
                <Column {...{ ...config, data: selectedData }} />
              )}
              {graphType === "Bar" && (
                <Bar {...{ ...config, data: selectedData }} />
              )}
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

export default withIsVisibleHook(GraphAlertsByDay, "Graph_alerts_by_day");
