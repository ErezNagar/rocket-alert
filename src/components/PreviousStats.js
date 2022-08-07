import PropTypes from "prop-types";
import { Row, Col } from "antd";
import Tile from "./Tile";
import {
  getToday,
  getYesterday,
  getPastWeek,
  getPastMonth,
  getPastYear,
  displayFormat,
} from "../date_helper";

const PreviousStats = (props) => (
  <section className="section">
    <Row gutter={[24, 24]}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Yesterday"}
          subtitle={displayFormat(getYesterday())}
          fromDate={getYesterday()}
          toDate={getYesterday()}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Past Week"}
          subtitle={`Since ${displayFormat(getPastWeek())}`}
          fromDate={getPastWeek()}
          toDate={getToday()}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Past Month"}
          subtitle={`Since ${displayFormat(getPastMonth())}`}
          fromDate={getPastMonth()}
          toDate={getToday()}
          alertsClient={props.alertsClient}
        />
      </Col>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Tile
          title={"Past Year"}
          subtitle={`Since ${displayFormat(getPastYear())}`}
          fromDate={getPastYear()}
          toDate={getToday()}
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
