import React, { useEffect, useState, useCallback } from "react";
import PropTypes from "prop-types";
import { Row, Col, Spin } from "antd";
import {
  getNow,
  is4WeeksDifference,
  weekRangeWithYearFormat,
} from "../../utilities/date_helper";
import { isBefore } from "date-fns";
import { Column, Bar } from "@ant-design/plots";
import withIsVisibleHook from "./../withIsVisibleHook";
import Utilities from "../../utilities/utilities";
import { ALERTS_BY_SOURCE } from "./data/graphs";
import graphUtils from "./graphUtils/graphUtils";
import { LoadingOutlined } from "@ant-design/icons";

const GRAPH_CONFIG = {
  COLUMN: {
    xField: "week",
    yField: "alerts",
    isGroup: true,
    seriesField: "origin",
    // columnWidthRatio: 0.5,
    columnStyle: {
      radius: [20, 20, 0, 0],
    },
    height: 400,
    color: graphUtils.getColorByOrigin,
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
    yField: "week",
    isGroup: true,
    seriesField: "origin",
    barStyle: {
      radius: [20, 20, 0, 0],
    },
    height: 1400,
    legend: {
      layout: "vertical",
      position: "top-left",
    },
    autoFit: false,
    maxBarWidth: 40,
    minBarWidth: 13,
    color: graphUtils.getColorByOrigin,
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
        style: {
          fill: "black",
          fontSize: 14,
        },
      },
    },
    xAxis: false,
  },
};

// The date from which the new, non-hardcoded graph data starts.
const DYNAMIC_DATA_START_DATE = new Date(2025, 0, 30);

const GraphAlertBySource = ({
  alertData,
  alertTimeframes,
  isLoading,
  isError,
  isIntersectingRef,
}) => {
  const [showGraph, setShowGraph] = useState(false);
  const [data, setData] = useState(null);
  const [graphType, setGraphType] = useState("Column");
  const [config, setConfig] = useState(null);

  const buildGraph = useCallback(() => {
    let data = [];
    let originSouthCount = 0;
    let originNorthCount = 0;
    let originIranCount = 0;
    let originYemenCount = 0;
    let currentDate = DYNAMIC_DATA_START_DATE;

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const alertDate = new Date(year, month - 1, day);
      // Skip dates before the relevant date starts
      if (isBefore(alertDate, currentDate)) {
        return;
      }
      if (is4WeeksDifference(currentDate, alertDate)) {
        const weekRange = weekRangeWithYearFormat(currentDate, alertDate);
        data.push({
          week: weekRange,
          alerts: originSouthCount,
          origin: graphUtils.ALERT_SOURCE.HAMAS.LABEL,
        });
        data.push({
          week: weekRange,
          alerts: originNorthCount,
          origin: graphUtils.ALERT_SOURCE.HEZBOLLAH.LABEL,
        });
        if (originIranCount) {
          data.push({
            week: weekRange,
            alerts: originIranCount,
            origin: graphUtils.ALERT_SOURCE.IRAN.LABEL,
          });
        }
        if (originYemenCount) {
          data.push({
            week: weekRange,
            alerts: originYemenCount,
            origin: graphUtils.ALERT_SOURCE.HOUTHIS.LABEL,
          });
        }

        currentDate = alertDate;
        originSouthCount = 0;
        originNorthCount = 0;
        originIranCount = 0;
        originYemenCount = 0;
      }

      const alertOrigin = graphUtils.determineAlertOrigin(
        alerts,
        alertTimeframes
      );
      originSouthCount += alertOrigin.originSouthCount;
      originNorthCount += alertOrigin.originNorthCount;
      originIranCount += alertOrigin.originIranCount;
      originYemenCount += alertOrigin.originYemenCount;
    });

    const weekFormat = weekRangeWithYearFormat(currentDate, getNow());
    data.push({
      week: weekFormat,
      alerts: originSouthCount,
      origin: graphUtils.ALERT_SOURCE.HAMAS.LABEL,
    });
    if (originNorthCount) {
      data.push({
        week: weekFormat,
        alerts: originNorthCount,
        origin: graphUtils.ALERT_SOURCE.HEZBOLLAH.LABEL,
      });
    }
    if (originIranCount) {
      data.push({
        week: weekFormat,
        alerts: originIranCount,
        origin: graphUtils.ALERT_SOURCE.IRAN.LABEL,
      });
    }
    if (originYemenCount) {
      data.push({
        week: weekFormat,
        alerts: originYemenCount,
        origin: graphUtils.ALERT_SOURCE.HOUTHIS.LABEL,
      });
    }

    setData([...ALERTS_BY_SOURCE, ...data]);
  }, [alertData, alertTimeframes]);

  const updateGraphConfig = () => {
    const type = Utilities.isSmallViewport() ? "Bar" : "Column";
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
    <section ref={isIntersectingRef} className="graph">
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

GraphAlertBySource.propTypes = {
  alertData: PropTypes.array,
  alertTimeframes: PropTypes.object.isRequired,
  isLoading: PropTypes.bool.isRequired,
  isError: PropTypes.bool.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};
GraphAlertBySource.defaultProps = {
  alertData: [],
};

export default withIsVisibleHook(GraphAlertBySource, "GraphAlertBySource");
