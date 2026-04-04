import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Row, Col, Spin } from "antd";
import { Column, Bar } from "@ant-design/plots";
import Tracking from "../../tracking";
import withIsVisibleHook from "./../withIsVisibleHook";
import Utilities from "../../utilities/utilities";
import { ALERTS_BY_DAY } from "./data/graphs";
import graphUtils from "./graphUtils/graphUtils";
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

const GraphAlertsByDay = ({ isLoading, isError, isIntersectingRef }) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedData, setSelectedMonthData] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [graphType, setGraphType] = useState("Column");
  const [config, setConfig] = useState(null);

  const buildGraph = () => {
    const selectedYear = ALERTS_BY_DAY.years[0];
    const selectedMonth = ALERTS_BY_DAY[selectedYear].months[0];
    const selectedData = ALERTS_BY_DAY[selectedYear][selectedMonth];

    setData(ALERTS_BY_DAY);
    setSelectedYear(selectedYear);
    setSelectedMonth(selectedMonth);
    setSelectedMonthData(selectedData);
  };

  const updateGraphConfig = useCallback(() => {
    const type = Utilities.isMediumViewport() ? "Bar" : "Column";
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
    buildGraph();
  }, []);

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
    <section ref={isIntersectingRef} className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>Alerts by day</h2>
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

GraphAlertsByDay.propTypes = {
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(GraphAlertsByDay, "GraphAlertsByDay");
