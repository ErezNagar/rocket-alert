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
      0, 37, 853, 214, 2198, 459, 607, 390, 582, 609, 329, 1905, 16, 386, 23,
      189, 42, 8, 464, 775, 823, 384, 493, 548, 474, 786, 0,
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

const YEARS = {
  2024: {
    SPARKLINE_DATA: [
      107, 11, 9, 10, 23, 181, 14, 70, 133, 2, 11, 8, 5, 8, 11, 25, 21, 12, 4,
      19, 4, 1, 12, 3, 1, 17, 19, 20, 55, 2, 2, 6, 8, 3, 33, 7, 10, 24, 26, 28,
      1, 2, 1, 33, 26, 11, 4, 33, 1, 11, 12, 32, 47, 37, 21, 39, 26, 15, 6, 2,
      11, 58, 27, 10, 9, 14, 54, 26, 22, 9, 2, 16, 4, 5, 12, 3, 9, 22, 46, 28,
      27, 30, 18, 15, 25, 25, 21, 14, 31, 14, 57, 19, 40, 31, 19, 36, 14, 16,
      30, 37, 698, 12, 30, 11, 35, 10, 56, 23, 42, 35, 17, 11, 30, 5, 28, 2, 7,
      7, 26, 60, 88, 51, 50, 36, 51, 25, 37, 16, 28, 156, 136, 116, 78, 24, 23,
      9, 167, 77, 26, 81, 51, 22, 29, 53, 43, 77, 125, 66, 47, 49, 34, 44, 32,
      72, 98, 54, 161, 280, 33, 17, 9, 3, 51, 43, 9, 13, 2, 36, 20, 16, 13, 37,
      72, 4, 16, 33, 13, 37, 225, 9, 25, 55, 19, 18, 12, 51, 6, 18, 35, 31, 56,
      10, 17, 36, 41, 49, 41, 59, 9, 71, 18, 67, 2, 16, 55, 2, 18, 15, 7, 27,
      52, 88, 18, 10, 24, 66, 2, 10, 25, 16, 56, 23, 15, 27, 34, 72, 73, 14, 57,
      9, 181, 48, 21, 9, 15, 14, 23, 25, 22, 28, 48, 34, 5, 26, 45, 50, 37, 13,
      23, 36, 59, 155, 22, 28, 56, 41, 88, 54, 396, 380, 401, 178, 77, 205, 917,
      213, 67, 2120, 195, 178, 233, 177, 192, 527, 164, 216, 126, 251, 138, 306,
      431, 178, 130, 318, 88, 225, 309, 354, 303, 399, 159, 135, 138, 149, 114,
      381, 291, 136, 64, 355, 147, 76, 109, 330, 120, 230, 88, 56, 307, 214,
      265, 141, 84, 129, 52, 222, 193, 100, 83, 160, 62, 546, 95, 372, 1, 1, 1,
      108, 5, 1, 3, 12, 14, 2, 121, 1, 96, 156, 185, 219, 1, 244, 193, 5, 240,
      2,
    ],
    ALERT_COUNT: 27588,
  },
  2023: {
    SPARKLINE_DATA: [
      1, 4, 6, 1, 1, 5, 4, 3, 1, 2, 5, 1, 1, 2, 1, 6, 73, 18, 1, 2, 12, 23, 261,
      168, 110, 235, 3, 1, 2, 1, 1, 6, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 4104,
      200, 334, 245, 425, 127, 216, 199, 87, 163, 241, 49, 130, 87, 61, 92, 37,
      186, 59, 141, 122, 173, 71, 121, 99, 70, 86, 49, 86, 122, 51, 79, 20, 44,
      54, 50, 35, 76, 46, 30, 14, 54, 42, 54, 191, 79, 35, 41, 7, 10, 4, 195,
      170, 52, 61, 95, 38, 11, 95, 14, 32, 44, 43, 27, 21, 44, 35, 11, 24, 98,
      10, 149, 7, 19, 22, 18, 13, 9, 41, 69, 11, 6,
    ],
    ALERT_COUNT: 11655,
  },
  2022: {
    SPARKLINE_DATA: [5, 24, 1, 2, 1, 9, 5, 6, 1, 5, 90, 272, 394, 1, 1, 3, 2],
    ALERT_COUNT: 822,
  },
  2021: {
    SPARKLINE_DATA: [
      2, 2, 2, 1, 1, 28, 4, 7, 202, 1180, 1287, 814, 626, 838, 654, 333, 341,
      326, 409, 31, 1, 9, 3, 3, 3, 3, 4, 3, 2, 9, 46,
    ],
    ALERT_COUNT: 7174,
  },
  2020: {
    SPARKLINE_DATA: [
      1, 6, 1, 1, 4, 8, 2, 3, 1, 2, 1, 58, 88, 2, 2, 3, 2, 6, 4, 12, 1, 4, 1, 5,
      1, 2, 1, 7, 19, 1, 1, 3, 8, 2, 2, 6, 1,
    ],
    ALERT_COUNT: 272,
  },
  2019: {
    SPARKLINE_DATA: [
      2, 2, 9, 24, 13, 10, 1, 14, 42, 1, 197, 43, 1, 1, 3, 1, 4, 1066, 1108, 32,
      39, 2, 2, 1, 1, 2, 2, 88, 7, 9, 8, 1, 2, 4, 5, 1, 6, 1, 1, 2, 22, 2, 482,
      381, 66, 8, 10, 6, 8, 2, 9,
    ],
    ALERT_COUNT: 3754,
  },
  2018: {
    SPARKLINE_DATA: [
      1, 2, 2, 16, 168, 15, 35, 1, 53, 6, 5, 3, 3, 6, 230, 229, 4, 18, 1, 7, 8,
      80, 36, 21, 424, 10, 2, 13, 16, 2, 48, 38, 20, 7, 159, 402, 16, 1, 17,
      113, 12, 4, 2, 60, 51, 6, 36, 843, 201, 58,
    ],
    ALERT_COUNT: 3511,
  },
  2017: {
    SPARKLINE_DATA: [
      2, 2, 45, 2, 4, 1, 2, 2, 5, 62, 10, 1, 1, 2, 1, 8, 19, 60, 2, 4, 13, 17,
      4, 5, 6, 1, 31, 11, 24, 1, 82, 8, 38, 17, 2, 36, 3, 2, 5, 51,
    ],
    ALERT_COUNT: 592,
  },
  2016: {
    SPARKLINE_DATA: [
      6, 1, 9, 2, 1, 1, 3, 8, 3, 27, 2, 6, 77, 6, 774, 1, 2, 14, 23, 11, 29, 1,
    ],
    ALERT_COUNT: 1007,
  },
  2015: {
    SPARKLINE_DATA: [
      1, 1, 57, 7, 50, 18, 34, 2, 39, 22, 3, 3, 8, 2, 18, 2, 2, 2, 2, 6, 1, 2,
    ],
    ALERT_COUNT: 282,
  },
  2014: {
    SPARKLINE_DATA: [
      37, 853, 214, 2198, 459, 607, 390, 582, 609, 329, 1905, 16, 386, 23, 189,
      42, 8, 464, 775, 823, 384, 493, 548, 474, 786, 1, 1, 1, 2, 16, 6, 24, 1,
      1, 1,
    ],
    ALERT_COUNT: 13648,
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
      <section className="section">
        <h2>Rocket alerts in previous years</h2>
        <Row gutter={[24, 24]}>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2024"}
              sparklineData={YEARS[2024].SPARKLINE_DATA.filter(
                (_, idx) => (idx + 1) % 2 !== 0
              ).filter((_, idx) => (idx + 1) % 2 !== 0)}
              alertCount={YEARS[2024].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2023"}
              sparklineData={YEARS[2023].SPARKLINE_DATA.filter(
                (_, idx) => (idx + 1) % 2 !== 0
              )}
              alertCount={YEARS[2023].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2022"}
              sparklineData={YEARS[2022].SPARKLINE_DATA}
              alertCount={YEARS[2022].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2021"}
              sparklineData={YEARS[2021].SPARKLINE_DATA}
              alertCount={YEARS[2021].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2020"}
              sparklineData={YEARS[2020].SPARKLINE_DATA}
              alertCount={YEARS[2020].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2019"}
              sparklineData={YEARS[2019].SPARKLINE_DATA}
              alertCount={YEARS[2019].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2018"}
              sparklineData={YEARS[2018].SPARKLINE_DATA}
              alertCount={YEARS[2018].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2017"}
              sparklineData={YEARS[2017].SPARKLINE_DATA}
              alertCount={YEARS[2017].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2016"}
              sparklineData={YEARS[2016].SPARKLINE_DATA}
              alertCount={YEARS[2016].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2015"}
              sparklineData={YEARS[2015].SPARKLINE_DATA}
              alertCount={YEARS[2015].ALERT_COUNT}
              isStatic
            />
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Tile
              title={"2014"}
              sparklineData={YEARS[2014].SPARKLINE_DATA}
              alertCount={YEARS[2014].ALERT_COUNT}
              isStatic
            />
          </Col>
        </Row>
      </section>
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
