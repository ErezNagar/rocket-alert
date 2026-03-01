import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";
import Tile from "./Tile";
import withIsVisibleHook from "./withIsVisibleHook";
import Utilities from "../utilities/utilities";
import { getNow } from "../utilities/date_helper";

const OperationLionsRoar = ({ alertsClient, isIntersectingRef }) => {
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
                toDate={new Date(getNow())}
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
                toDate={new Date(getNow())}
                alertsClient={alertsClient}
                alertTypeId={Utilities.ALERT_TYPE_UAV}
                showAverage
              />
            </Col>
          </Row>
        </div>
      </div>
    </section>
  );
};

OperationLionsRoar.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(OperationLionsRoar, "OperationLionsRoar");
