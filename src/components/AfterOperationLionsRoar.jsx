import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./withIsVisibleHook";
import Utilities from "../utilities/utilities";
import { getYesterday, dayOfMonthFormat } from "../utilities/date_helper";

const config = {
  isStack: true,
  xField: "date",
  yField: "alerts",
  seriesField: "origin",
  columnStyle: (item) =>
    item.origin === "Rockets - Hezbollah"
      ? { radius: [20, 20, 0, 0] }
      : { radius: 0 },
  color: ["#F7E210", "#a09205"],
  appendPadding: Utilities.isSmallViewport()
    ? [30, 0, 0, 0]
    : [30, 250, 0, 250],
  label: false,
  xAxis: {
    label: {
      style: {
        fill: "black",
        fontSize: 14,
      },
    },
  },
  yAxis: false,
  legend: false,
};

const AfterOperationLionsRoar = ({ alertsClient, isIntersectingRef }) => {
  const [graphData, setGraphData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setIsError] = useState(false);

  const buildNewData = (alertData) => {
    let data = [];

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const alertDate = new Date(year, month - 1, day);
      const rocketAlerts = alerts.filter(
        (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_ROCKETS,
      );
      const UAVAlerts = alerts.filter(
        (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_UAV,
      );

      const formatedDate = dayOfMonthFormat(alertDate);
      data.push({
        date: formatedDate,
        alerts: rocketAlerts.length,
        origin: "Rockets - Hezbollah",
      });
      data.push({
        date: formatedDate,
        alerts: UAVAlerts.length,
        origin: "UAVs - Hezbollah",
      });
    });

    return data;
  };

  useEffect(() => {
    alertsClient
      .getDetailedAlerts(new Date("2026-04-08"), getYesterday())
      .then((res) => {
        if (!res.success) {
          setIsError(true);
          return;
        }
        const data = buildNewData(res.payload);
        setGraphData(data);
        setIsLoading(false);
      })
      .catch((res) => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);

  return (
    <>
      <div
        style={{
          backgroundColor: "#5c0011",
          color: "white",
          textAlign: "center",
          paddingTop: "2em",
          paddingBottom: "2em",
        }}
      >
        <h2 style={{ fontSize: "2em" }}>Since ceasefire with Iran</h2>
        {/* <div className="subtitle">Since April 8, 2026</div> */}
      </div>
      <section className="current-operation">
        <section ref={isIntersectingRef} className="graph">
          <Row justify={"center"}>
            <Col span={24}>
              <h2>Total rocket and UAV alerts</h2>
              <div className="subtitle">Since April 8, 2026</div>
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
              {graphData && <Column {...{ ...config, data: graphData }} />}
              {isError && (
                <div className="center-flexbox">
                  <Col>Something went wrong. Please try again.</Col>
                </div>
              )}
            </Col>
          </Row>
        </section>
      </section>
    </>
  );
};

export default withIsVisibleHook(
  AfterOperationLionsRoar,
  "AfterOperationLionsRoar",
);
