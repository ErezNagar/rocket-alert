import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";
import {
  getYesterday,
  getWeekBack,
  getMonthBack,
  getYearBack,
} from "../date_helper";

const PreviousStats = (props) => (
  <section className="section">
    <h2>.</h2>
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Yesterday"}
          subtitle={getYesterday()}
          fromDate={getYesterday()}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Past Week"}
          subtitle={`Since ${getWeekBack()}`}
          fromDate={getWeekBack()}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Past Month"}
          subtitle={`Since ${getMonthBack()}`}
          fromDate={getMonthBack()}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Past Year"}
          subtitle={`Since ${getYearBack()}`}
          fromDate={getYearBack()}
          alertsClient={props.alertsClient}
        />
      </Col>
    </Row>
  </section>
);

PreviousStats.propTypes = {
  alertsClient: PropTypes.object.isRequired,
};
export default PreviousStats;
