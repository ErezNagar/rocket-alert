import { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";
import Util from "../util";
import Tracking from "../tracking";

const PREVIUOS_OPERATIONS = {
  SHIELD_AND_ARROW: {
    SPARKLINE_DATA: [0, 0, 259, 168, 110, 235, 0, 0],
    ALERT_COUNT: 775,
  },
  BREAKING_DAWN: {
    SPARKLINE_DATA: [0, 0, 90, 270, 394, 0, 0],
    ALERT_COUNT: 754,
  },
  GUARDIAN_OF_THE_WALLS: {
    SPARKLINE_DATA: [
      7, 202, 1180, 1287, 814, 626, 838, 654, 333, 341, 326, 409, 31,
    ],
    ALERT_COUNT: 7000,
  },
  BLACK_BELT: {
    SPARKLINE_DATA: [0, 0, 482, 381, 66, 8, 0, 0],
    ALERT_COUNT: 928,
  },
  PROTECTIVE_EDGE: {
    SPARKLINE_DATA: [
      0, 37, 853, 214, 2198, 459, 607, 390, 582, 609, 329, 1905, 16, 386, 23, 189,
      42, 8, 464, 775, 823, 384, 493, 548, 474, 786, 0
    ],
    ALERT_COUNT: 12808,
  },
  PILLAR_OF_DEFENSE: {
    ALERT_COUNT: 1506,
  },
  CAST_LEAD: {
    ALERT_COUNT: 575,
  },
};

const PreviousOperations = (props) => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("previousOperations");
    }
  }, [isVisible]);

  return (
    <>
      <section ref={ref} className="section">
        <h2>Rocket alerts in previous conflicts</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"Operation Shield and Arrow"}
              subtitle={"May 9 2023 - May 13 2023"}
              fromDate={new Date("2023-05-09T00:00")}
              toDate={new Date("2023-05-13T00:00")}
              sparklineData={
                PREVIUOS_OPERATIONS.SHIELD_AND_ARROW.SPARKLINE_DATA
              }
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
      {/* <section className="section">
      <h2>Rocket alerts in previous years</h2>
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2022"}
            fromDate={new Date("2022-01-01")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2021"}
            fromDate={new Date("2021-01-01")}
            toDate={new Date("2021-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2020"}
            fromDate={new Date("2020-01-01")}
            toDate={new Date("2020-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2019"}
            fromDate={new Date("2019-01-01")}
            toDate={new Date("2019-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2018"}
            fromDate={new Date("2018-01-01")}
            toDate={new Date("2018-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2017"}
            fromDate={new Date("2017-01-01")}
            toDate={new Date("2017-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2016"}
            fromDate={new Date("2016-01-01")}
            toDate={new Date("2016-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2015"}
            fromDate={new Date("2015-01-01")}
            toDate={new Date("2015-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
        <Col xs={24} sm={12} md={8} lg={6}>
          <Tile
            title={"2014"}
            fromDate={new Date("2014-01-01")}
            toDate={new Date("2014-12-31")}
            alertsClient={props.alertsClient}
          />
        </Col>
      </Row>
    </section> */}
    </>
  );
};

PreviousOperations.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  showAverage: PropTypes.bool,
};
PreviousOperations.defaultProps = {
  showAverage: false,
};
export default PreviousOperations;
