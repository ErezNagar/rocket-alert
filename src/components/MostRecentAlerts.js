import PropTypes from "prop-types";
import { Row, Col } from "antd";
import FormattedAlertTime from "./FormattedAlertTime";
import FadeIn from "./FadeIn";

const MostRecentAlerts = (props) => (
  <div className="container">
    <h2>{"Most recent alerts"}</h2>

    {props.alerts.map((alert, idx) => (
      <FadeIn show={true} key={`${alert.name}_${alert.timeStamp}_${idx}`}>
        <Row gutter={[24, 24]} justify="center">
          <Col className="textRight" span={12}>
            <FormattedAlertTime timeStamp={alert.timeStamp} />
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
      </FadeIn>
    ))}
  </div>
);

MostRecentAlerts.propTypes = {
  alerts: PropTypes.array.isRequired,
};
export default MostRecentAlerts;
