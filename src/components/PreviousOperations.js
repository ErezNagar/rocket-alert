import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";

const PreviousOperations = (props) => (
  <section className="section">
    <h2>Previous operations</h2>
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Cast Lead"}
          subtitle={"27 Dec 2008 - 18 Jan 2009"}
          fromDate={"2008-12-27"}
          toDate={"2009-01-18"}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Pillar of Defense"}
          subtitle={"14 Nov 2012 - 21 Nov 2012"}
          fromDate={"2012-11-14"}
          toDate={"2012-11-21"}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Protective Edge"}
          subtitle={"8 July 2014 - 26 Aug 2014"}
          fromDate={"2014-07-08"}
          toDate={"2014-08-26"}
          alertsClient={props.alertsClient}
          showAverage
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Black Belt"}
          subtitle={"12 Nov 2019 - 16 Nov 2019"}
          fromDate={"2019-11-12"}
          toDate={"2019-11-16"}
          alertsClient={props.alertsClient}
          showAverage
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Operation Guardian of the Walls"}
          subtitle={"10 May 2021 - 21 May 2021"}
          fromDate={"2021-05-10"}
          toDate={"2021-05-21"}
          alertsClient={props.alertsClient}
          showAverage
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
