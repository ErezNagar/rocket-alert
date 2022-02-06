import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";

const PreviousOperations = (props) => (
  <section className="section">
    <h2>Rocket alerts in previous conflicts</h2>
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Guardian of the Walls"}
          subtitle={"May 10, 2021 - May 21, 2021"}
          fromDate={new Date("2021-05-10")}
          toDate={new Date("2021-05-21")}
          alertsClient={props.alertsClient}
          showAverage
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Black Belt"}
          subtitle={"Nov 12, 2019 - Nov 16, 2019"}
          fromDate={new Date("2019-11-12")}
          toDate={new Date("2019-11-16")}
          alertsClient={props.alertsClient}
          showAverage
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Protective Edge"}
          subtitle={"July 8, 2014 - Aug 26, 2014"}
          fromDate={new Date("2014-07-08")}
          toDate={new Date("2014-08-26")}
          alertsClient={props.alertsClient}
          showAverage
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Pillar of Defense"}
          subtitle={"Nov 14, 2012 - Nov 21, 2012"}
          fromDate={new Date("2012-11-14")}
          toDate={new Date("2012-11-21")}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Cast Lead"}
          subtitle={"Dec 27, 2008 - Jan 18, 2009"}
          fromDate={new Date("2008-12-27")}
          toDate={new Date("2009-01-18")}
          alertsClient={props.alertsClient}
        />
      </Col>
    </Row>
  </section>
);

PreviousOperations.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  showAverage: PropTypes.bool,
};
PreviousOperations.defaultProps = {
  showAverage: false,
};
export default PreviousOperations;
