import PropTypes from "prop-types";
import { useState } from "react";
import { Row, Col } from "antd";
import FormattedAlertTime from "./FormattedAlertTime";
import FadeIn from "./FadeIn";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";

const MostRecentAlerts = (props) => {
  const [showResetFocus, setShowResetFocus] = useState(false);

  const handleAlertLocationClick = (alert, idx) => {
    if (!alert.lon || !alert.lat) {
      return;
    }
    Tracking.alertLocationClick(idx);
    setShowResetFocus(true);
    props.onAlertLocationClick(alert);
  };

  const handleResetFocus = () => {
    setShowResetFocus(false);
    props.onAlertLocationClick("reset");
  };

  return (
    <div ref={props.isIntersectingRef} className="container">
      <h2>{"Most recent alerts"}</h2>

      <div className={props.alerts.length <= 15 ? "list" : "list scrollable"}>
        {props.alerts.map((alert, idx) => (
          <FadeIn show={true} key={`${alert.name}_${alert.timeStamp}_${idx}`}>
            <Row justify="center">
              <Col className="textRight" xs={10} md={10}>
                <FormattedAlertTime timeStamp={alert.timeStamp} />
              </Col>
              <Col className="textLeft" xs={12} md={12}>
                <span
                  className={!alert.lon || !alert.lat ? "" : "location"}
                  onClick={() => handleAlertLocationClick(alert, idx)}
                >
                  {alert.englishName || alert.name}
                </span>
              </Col>
            </Row>
          </FadeIn>
        ))}
      </div>
      {showResetFocus && (
        <div className="showAll" onClick={() => handleResetFocus()}>
          Show All
        </div>
      )}
    </div>
  );
};

MostRecentAlerts.propTypes = {
  alerts: PropTypes.array.isRequired,
  onAlertLocationClick: PropTypes.func,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

MostRecentAlerts.defaultProps = {
  recentAlertMapFocus() {},
};

export default withIsVisibleHook(MostRecentAlerts, "MostRecentAlerts");
