import PropTypes from "prop-types";
import { Row, Col } from "antd";
import FormattedTimeAlert from "./FormattedTimeAlert";

const MostRecentAlerts = (props) => (
  <section className="section mostRecentAlerts">
    <h2>{"Most recent alerts"}</h2>

    {props.alerts.map((alert, idx) => (
      <Row
        gutter={[24, 24]}
        justify="center"
        key={`${alert.englishName}_${idx}`}
      >
        <Col className="textRight" span={12}>
          <FormattedTimeAlert alert={alert} />
        </Col>
        <Col className="textLeft" span={12}>
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${alert.lat},${alert.lon}`}
            target="_blank"
            rel="noreferrer"
          >
            {alert.englishName || alert.name}
          </a>
        </Col>
      </Row>
    ))}
  </section>
);

MostRecentAlerts.propTypes = {
  alerts: PropTypes.array.isRequired,
};
export default MostRecentAlerts;
