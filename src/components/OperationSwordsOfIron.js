import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";
import Tile from "./Tile";
import withIsVisibleHook from "./withIsVisibleHook";
import AlertGraphs from "./Graphs/AlertGraphs";
import Utilities from "../utilities/utilities";

const OperationSwordsOfIron = ({ alertsClient, isIntersectingRef }) => {
  // const [mostTargetedLocations, setMostTargetedLocations] = useState(null);
  // const [mostTargetedRegions, setMostTargetedRegions] = useState(null);

  // useEffect(() => {
  //   const getMostTargetedLocations = () =>
  //     alertsClient
  //       .getMostTargetedLocations(new Date("2023-10-07"), getNow())
  //       .then((res) => res.payload)
  //       .catch((error) => {
  //         Tracking.mostTargetedLocationsError(error);
  //         return null;
  //       });

  //   const getMostTargetedRegions = () =>
  //     alertsClient
  //       .getMostTargetedRegions(new Date("2023-10-07"), getNow())
  //       .then((res) => res.payload)
  //       .catch((error) => {
  //         Tracking.mostTargetedRegionError(error);
  //         return null;
  //       });

  //   getMostTargetedLocations().then((res) => {
  //     if (!res) {
  //       return;
  //     }
  //     setMostTargetedLocations(res);
  //   });

  //   getMostTargetedRegions().then((res) => {
  //     if (!res) {
  //       return;
  //     }
  //     setMostTargetedRegions(res);
  //   });
  // }, [alertsClient]);

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

      <AlertGraphs alertsClient={alertsClient} />
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
