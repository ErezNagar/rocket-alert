import PropTypes from "prop-types";
import withIsVisibleHook from "./withIsVisibleHook";
import { Row, Col } from "antd";
import Tile from "./Tile";
import { PREVIUOS_OPERATIONS, YEARS } from "./Graphs/data/sparklines";

const PreviousOperations = ({ isIntersectingRef }) => (
  <>
    <section ref={isIntersectingRef} className="section">
      <h2>Rocket alerts in previous conflicts</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Shield and Arrow"}
            subtitle={"May 9 2023 - May 13 2023"}
            fromDate={new Date("2023-05-09T00:00")}
            toDate={new Date("2023-05-13T00:00")}
            sparklineData={PREVIUOS_OPERATIONS.SHIELD_AND_ARROW.SPARKLINE_DATA}
            alertCount={PREVIUOS_OPERATIONS.SHIELD_AND_ARROW.ALERT_COUNT}
            isStatic
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Breaking Dawn"}
            subtitle={"Aug 5 2022 - Aug 7 2022"}
            fromDate={new Date("2022-08-05T00:00")}
            toDate={new Date("2022-08-07T00:00")}
            sparklineData={PREVIUOS_OPERATIONS.BREAKING_DAWN.SPARKLINE_DATA}
            alertCount={PREVIUOS_OPERATIONS.BREAKING_DAWN.ALERT_COUNT}
            isStatic
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Guardian of the Walls"}
            subtitle={"May 10, 2021 - May 21, 2021"}
            fromDate={new Date("2021-05-10")}
            toDate={new Date("2021-05-21")}
            sparklineData={
              PREVIUOS_OPERATIONS.GUARDIAN_OF_THE_WALLS.SPARKLINE_DATA
            }
            alertCount={PREVIUOS_OPERATIONS.GUARDIAN_OF_THE_WALLS.ALERT_COUNT}
            isStatic
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Black Belt"}
            subtitle={"Nov 12, 2019 - Nov 16, 2019"}
            fromDate={new Date("2019-11-12")}
            toDate={new Date("2019-11-16")}
            sparklineData={PREVIUOS_OPERATIONS.BLACK_BELT.SPARKLINE_DATA}
            alertCount={PREVIUOS_OPERATIONS.BLACK_BELT.ALERT_COUNT}
            isStatic
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Protective Edge"}
            subtitle={"July 8, 2014 - Aug 26, 2014"}
            fromDate={new Date("2014-07-08")}
            toDate={new Date("2014-08-26")}
            sparklineData={PREVIUOS_OPERATIONS.PROTECTIVE_EDGE.SPARKLINE_DATA}
            alertCount={PREVIUOS_OPERATIONS.PROTECTIVE_EDGE.ALERT_COUNT}
            isStatic
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Pillar of Defense"}
            subtitle={"Nov 14, 2012 - Nov 21, 2012"}
            fromDate={new Date("2012-11-14")}
            toDate={new Date("2012-11-21")}
            alertCount={PREVIUOS_OPERATIONS.PILLAR_OF_DEFENSE.ALERT_COUNT}
            isStatic
            showAverage
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"Operation Cast Lead"}
            subtitle={"Dec 27, 2008 - Jan 18, 2009"}
            fromDate={new Date("2008-12-27")}
            toDate={new Date("2009-01-18")}
            alertCount={PREVIUOS_OPERATIONS.CAST_LEAD.ALERT_COUNT}
            isStatic
            showAverage
          />
        </Col>
      </Row>
    </section>
    <section className="section">
      <h2>Rocket alerts in previous years</h2>
      <Row gutter={[24, 24]}>
        {YEARS.map((data) => (
          <Col xs={24} sm={12} md={8} lg={6} key={data.year}>
            <Tile
              title={data.year.toString()}
              sparklineData={
                data.year === 2024 || data.year === 2023
                  ? // Drop points for better visualization
                    data.points
                      .filter((_, idx) => (idx + 1) % 2 !== 0)
                      .filter((_, idx) => (idx + 1) % 2 !== 0)
                  : data.points
              }
              alertCount={data.alertCount}
              isStatic
            />
          </Col>
        ))}
      </Row>
    </section>
  </>
);

PreviousOperations.propTypes = {
  // For Tracking
  isIntersectingRef: PropTypes.object,
};

export default withIsVisibleHook(PreviousOperations, "PreviousOperations");
