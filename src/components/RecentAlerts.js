import PropTypes from "prop-types";
import { Row, Col } from "antd";
import { format } from "date-fns";

const RecentAlerts = (props) => (
  <section className="section recentAlerts">
    <h2>{"Recent alerts"}</h2>

    {props.recentAlerts.map((alert, idx) => (
      <Row
        gutter={[24, 24]}
        justify="center"
        key={`${alert.englishName}_${idx}`}
      >
        <Col className="textRight" span={12}>
          {format(new Date(alert.timeStamp), "HH:mm")}
        </Col>
        <Col className="textLeft" span={12}>
          {alert.englishName || alert.name}
        </Col>
      </Row>
    ))}
  </section>
);

RecentAlerts.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  recentAlerts: PropTypes.array.isRequired,
};
export default RecentAlerts;
