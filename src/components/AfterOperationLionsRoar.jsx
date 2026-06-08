import React, { useState, useEffect } from "react";
import { Row, Col, Spin } from "antd";
import wretch from "wretch";
import { LoadingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import withIsVisibleHook from "./withIsVisibleHook";
import Utilities from "../utilities/utilities";
import { dayOfMonthFormat } from "../utilities/date_helper";
import graphUtils from "./Graphs/graphUtils/graphUtils";

const YEMEN_ALERT_TIMEFRAMES_URL =
  "https://raw.githubusercontent.com/ErezNagar/rocket-alert/refs/heads/master/src/data/yemen_alerts.json";
const IRAN_ALERT_TIMEFRAMES_URL =
  "https://raw.githubusercontent.com/ErezNagar/rocket-alert/refs/heads/master/src/data/iran-alerts.json";

const config = {
  isStack: true,
  xField: "date",
  yField: "alerts",
  seriesField: "origin",
  columnStyle: (item) =>
    item.origin === "Rockets - Hezbollah"
      ? { radius: [20, 20, 0, 0] }
      : { radius: 0 },
  color: graphUtils.getColorByOrigin,
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

  const buildData = (alertData, alertTimeframes) => {
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

      const missilesOrigin = graphUtils.determineAlertOrigin(
        rocketAlerts,
        alertTimeframes,
      );
      const UAVsOrigin = graphUtils.determineAlertOrigin(
        UAVAlerts,
        alertTimeframes,
      );
      const formatedDate = dayOfMonthFormat(alertDate);

      if (missilesOrigin.originIranCount) {
        data.push({
          date: formatedDate,
          alerts: missilesOrigin.originIranCount,
          origin: "Missiles - Iran",
        });
      }
      if (UAVsOrigin.originIranCount) {
        data.push({
          date: formatedDate,
          alerts: UAVsOrigin.originIranCount,
          origin: "UAVs - Iran",
        });
      }
      if (missilesOrigin.originNorthCount) {
        data.push({
          date: formatedDate,
          alerts: missilesOrigin.originNorthCount,
          origin: "Rockets - Hezbollah",
        });
      }
      if (UAVsOrigin.originNorthCount) {
        data.push({
          date: formatedDate,
          alerts: UAVsOrigin.originNorthCount,
          origin: "UAVs - Hezbollah",
        });
      }
      if (missilesOrigin.originYemenCount) {
        data.push({
          date: formatedDate,
          alerts: missilesOrigin.originYemenCount,
          origin: "Missiles - Houthis",
        });
      }
      if (UAVsOrigin.originYemenCount) {
        data.push({
          date: formatedDate,
          alerts: UAVsOrigin.originYemenCount,
          origin: "UAVs - Houthis",
        });
      }
    });

    return data;
  };

  useEffect(() => {
    const loadYemenAlertTimeframes = () =>
      wretch(YEMEN_ALERT_TIMEFRAMES_URL)
        .get()
        .json((res) =>
          res.map(([start, end]) => [Date.parse(start), Date.parse(end)]),
        );

    const loadIranAlertTimeframes = () =>
      wretch(IRAN_ALERT_TIMEFRAMES_URL)
        .get()
        .json((res) =>
          res.map(([start, end]) => [Date.parse(start), Date.parse(end)]),
        );

    Promise.all([
      loadYemenAlertTimeframes(),
      loadIranAlertTimeframes(),
      alertsClient.getAlertsSinceFixedDate(),
    ])
      .then((values) => {
        const yemenAlertTimeframes = values[0] || [];
        const iranAlertTimeframes = values[1] || [];
        const res = values[2] || [];

        if (!res || !res.success) {
          setIsLoading(false);
          setIsError(true);
          return;
        }

        const filteredData = res.payload.filter(
          (item) => item.date >= "2026-04-17",
        );

        if (filteredData && filteredData[0]) {
          filteredData[0].alerts = filteredData[0].alerts.filter(
            (alert) =>
              Date.parse(alert.timeStamp) >= Date.parse("2026-04-17T00:00:00"),
          );

          const data = buildData(filteredData, {
            yemen: yemenAlertTimeframes,
            iran: iranAlertTimeframes,
            falseAlerts: [],
          });
          setGraphData(data);
          setIsLoading(false);
        }
      })
      .catch((e) => {
        console.error("Error LionsRoar - getAlertsSinceFixedDate", e);
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
        <h2 style={{ fontSize: "2em" }}>Since ceasefire with Lebanon</h2>
      </div>
      <section className="current-operation">
        <section ref={isIntersectingRef} className="graph">
          <Row justify={"center"}>
            <Col span={24}>
              <h2>Total rocket and UAV alerts</h2>
              <div className="subtitle">Since April 17, 2026</div>
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
