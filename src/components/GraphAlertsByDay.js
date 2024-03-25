import React, { useEffect, useState } from "react";
import { Row, Col, Spin } from "antd";
import { eachDayOfInterval, isSameDay } from "date-fns";
import { getYesterday, dayOfMonthFormat } from "../date_helper";
import { Column, Bar } from "@ant-design/plots";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";
import Util from "../util";
import { LoadingOutlined } from "@ant-design/icons";

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
    color: ["#008000", "#F7E210", "#5c0011"],
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
      layout: "horizontal",
      position: "top-left",
    },
    maxBarWidth: 40,
    minBarWidth: 13,
    color: ["#008000", "#F7E210", "#5c0011"],
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

const GraphAlertsByDay = ({ alertData, isLoading, isError }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [graphType, setGraphType] = useState("Column");
  const [config, setConfig] = useState(null);

  useEffect(() => {
    if (alertData) {
      buildGraph();
    }
  }, [alertData]);

  useEffect(() => {
    if (selectedMonth) {
      updateGraphConfig();
    }
  }, [selectedMonth]);

  const buildGraph = () => {
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
        alertData[dataIndex].alerts.forEach((alert) => {
          if (Util.isRegionInSouth(alert.areaNameEn)) {
            originSouthCount += 1;
          } else if (Util.isRegionInNorth(alert.areaNameEn)) {
            originNorthCount += 1;
          }
        });

        /* If there's alert data for this dateInterval, use it
            Otherwise, there's no alert data since alerts = 0
            */
        if (isSameDay(dateInterval, dateOfAlerts)) {
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: originSouthCount,
            origin: "Hamas (Gaza)",
          });
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: originNorthCount,
            origin: "Hezbollah (Southern Lebanon)",
          });
          dataIndex = dataIndex + 1;
        } else {
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: 0,
            origin: "Hamas (Gaza)",
          });
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: 0,
            origin: "Hezbollah (Southern Lebanon)",
          });
        }
      }
    });

    const selectedMonth = data.months[data.months.length - 1];

    setData(data);
    setSelectedMonth(selectedMonth);
  };

  const updateGraphConfig = () => {
    const type = Util.isMediumViewport() ? "Bar" : "Column";
    let height = 200;

    if (type === "Bar") {
      if (data[selectedMonth].length <= 10) {
        height = 200;
      } else if (data[selectedMonth].length <= 20) {
        height = 400;
      } else if (data[selectedMonth].length <= 40) {
        height = 800;
      } else {
        height = 1300;
      }
    }

    setGraphType(type);
    setConfig({
      data: data[selectedMonth],
      ...(type === "Column" ? GRAPH_CONFIG.COLUMN : GRAPH_CONFIG.BAR),
      height: type === "Column" ? 400 : height,
    });
    setShowGraph(true);
  };

  const handleMonthClick = () => {
    const month = document.getElementById("month-select").value;
    Tracking.graphMonthClick(month);
    setSelectedMonth(month);
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
                    id="month-select"
                    defaultValue={data.months[data.months.length - 1]}
                    onChange={(e) => handleMonthClick(e)}
                  >
                    {data.months.map((month) => (
                      <option value={month} key={month}>
                        {month}
                      </option>
                    ))}
                  </select>
                </div>
              </Row>
              {graphType === "Column" && <Column {...config} />}
              {graphType === "Bar" && <Bar {...config} />}
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
