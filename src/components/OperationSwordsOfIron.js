import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";
import Tile from "./Tile";
import withIsVisibleHook from "./withIsVisibleHook";
import Utilities from "../utilities/utilities";
import GraphTotalAlerts from "./Graphs/GraphTotalAlerts";
import GraphAlertsByDay from "./Graphs/GraphAlertsByDay";
import GraphAlertsBySource from "./Graphs/GraphAlertsBySource";

const OperationSwordsOfIron = ({ alertsClient, isIntersectingRef }) => {
  return (
    <section className="current-operation">
      <div ref={isIntersectingRef} className="currentOperationTilesContainer">
        <div className="currentOperationTile">
          <h2>Operation Swords of Iron</h2>
          <div className="subtitle">Oct 7, 2023 - Oct 10, 2025</div>
          <Row gutter={[24, 24]} justify={"center"}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Rocket Alerts"}
                subtitle={"Oct 7, 2023 - Oct 10, 2025"}
                fromDate={new Date("2023-10-07")}
                toDate={new Date("2025-10-10")}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_ROCKETS}
                showAverage
                shouldOptimizeSparkline
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"UAV Alerts"}
                subtitle={"Oct 7, 2023 - Oct 10, 2025"}
                fromDate={new Date("2023-10-07")}
                toDate={new Date("2025-10-10")}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_UAV}
                showAverage
                shouldOptimizeSparkline
              />
            </Col>
          </Row>
        </div>
      </div>

      <GraphTotalAlerts />
      <GraphAlertsBySource />
      <GraphAlertsByDay />
    </section>
  );
};

OperationSwordsOfIron.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(
  OperationSwordsOfIron,
  "OperationSwordsOfIron",
);
