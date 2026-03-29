import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import wretch from "wretch";
import { Row, Col, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { Column } from "@ant-design/plots";
import { dayOfMonthFormat, getYesterday } from "../utilities/date_helper";
import Tile from "./Tile";
import withIsVisibleHook from "./withIsVisibleHook";
import Utilities from "../utilities/utilities";
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
    item.origin === "Missiles - Iran"
      ? { radius: [20, 20, 0, 0] }
      : { radius: 0 },
  color: graphUtils.getColorByOrigin,
  appendPadding: Utilities.isSmallViewport()
    ? [30, 0, 0, 0]
    : [30, 200, 0, 200],
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

const OperationLionsRoar = ({ alertsClient, isIntersectingRef }) => {
  const [alertData, setAlertData] = useState([]);
  const [alertTimeframes, setAlertTimeframes] = useState({
    yemen: [],
    iran: [],
    falseAlerts: [],
  });
  const [showGraph, setShowGraph] = useState(false);
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

      const rocketsOrigin = graphUtils.determineAlertOrigin(
        rocketAlerts,
        alertTimeframes,
      );

      const UAVOrigin = graphUtils.determineAlertOrigin(
        UAVAlerts,
        alertTimeframes,
      );

      const formatedDate = dayOfMonthFormat(alertDate);
      if (rocketsOrigin.originIranCount) {
        data.push({
          date: formatedDate,
          alerts: rocketsOrigin.originIranCount,
          origin: "Missiles - Iran",
        });
      }
      if (UAVOrigin.originIranCount) {
        data.push({
          date: formatedDate,
          alerts: UAVOrigin.originIranCount,
          origin: "UAVs - Iran",
        });
      }
      if (rocketsOrigin.originNorthCount) {
        data.push({
          date: formatedDate,
          alerts: rocketsOrigin.originNorthCount,
          origin: "Rockets - Hezbollah",
        });
      }
      if (UAVOrigin.originNorthCount) {
        data.push({
          date: formatedDate,
          alerts: UAVOrigin.originNorthCount,
          origin: "UAVs - Hezbollah",
        });
      }
      if (rocketsOrigin.originYemenCount) {
        data.push({
          date: formatedDate,
          alerts: rocketsOrigin.originYemenCount,
          origin: "Missiles - Houthis",
        });
      }
      if (UAVOrigin.originYemenCount) {
        data.push({
          date: formatedDate,
          alerts: UAVOrigin.originYemenCount,
          origin: "UAVs - Houthis",
        });
      }
    });

    return data;
  };

  const buildGraph = (payload) => {
    const data = buildNewData(payload);
    setGraphData(data);
    setIsLoading(false);
    setShowGraph(true);
  };

  /* eslint-disable react-hooks/exhaustive-deps */
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
      alertsClient.getDetailedAlerts(
        new Date("2026-02-28"),
        new Date(getYesterday()),
      ),
    ])
      .then((values) => {
        const yemenAlertTimeframes = values[0] || [];
        const iranAlertTimeframes = values[1] || [];
        const alertData = values[2] || [];

        setAlertTimeframes({
          yemen: yemenAlertTimeframes,
          iran: iranAlertTimeframes,
          falseAlerts: [],
        });
        setAlertData(alertData.payload);
      })
      .catch((res) => {
        setIsLoading(false);
        setIsError(true);
      });
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (alertData.length > 0) {
      buildGraph(alertData);
    }
  }, [alertData]);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section className="current-operation">
      <div
        ref={isIntersectingRef}
        className="currentOperationTilesContainer newest"
      >
        <div className="currentOperationTile">
          <h2>Operation Lion's Roar</h2>
          <div className="subtitle">Joint Israel & US attack on Iran</div>
          <Row gutter={[24, 24]} justify={"center"}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Rocket Alerts"}
                subtitle={"Since February 28, 2026"}
                fromDate={new Date("2026-02-28")}
                toDate={new Date(getYesterday())}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_ROCKETS}
                showAverage
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"UAV Alerts"}
                subtitle={"Since February 28, 2026"}
                fromDate={new Date("2026-02-28")}
                toDate={new Date(getYesterday())}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_UAV}
                showAverage
              />
            </Col>
          </Row>
        </div>
      </div>
      <section ref={isIntersectingRef} className="graph">
        <Row justify={"center"}>
          <Col span={24}>
            <h2>Total rocket and UAV alerts</h2>
            <div className="subtitle">Since February 28, 2026</div>
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
            {showGraph && <Column {...{ ...config, data: graphData }} />}
            {isError && (
              <div className="center-flexbox">
                <Col>Something went wrong. Please try again.</Col>
              </div>
            )}
          </Col>
        </Row>
      </section>
    </section>
  );
};

OperationLionsRoar.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(OperationLionsRoar, "OperationLionsRoar");
