import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Row, Col, Spin } from "antd";
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

const GraphAlertBySource = ({ isLoading, isError, isIntersectingRef }) => {
  const [data, setData] = useState(null);

  const getConfig = () =>
    Utilities.isSmallViewport() ? GRAPH_CONFIG.BAR : GRAPH_CONFIG.COLUMN;

  useEffect(() => {
    setData(ALERTS_BY_SOURCE);
  }, []);

  return (
    <section ref={isIntersectingRef} className="graph">
      <Row justify={"center"}>
        <Col span={24}>
          <h2>Alerts by source</h2>
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
          {data && (
            <>
              <Col>
                {Utilities.isSmallViewport() ? (
                  <Bar
                    {...{
                      data,
                      ...getConfig(),
                    }}
                  />
                ) : (
                  <Column
                    {...{
                      data,
                      ...getConfig(),
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
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(GraphAlertBySource, "GraphAlertBySource");
