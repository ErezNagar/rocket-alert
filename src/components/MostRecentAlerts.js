import PropTypes from "prop-types";
import { Row, Col } from "antd";
import FormattedAlertTime from "./FormattedAlertTime";
import FadeIn from "./FadeIn";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";

const MostRecentAlerts = ({
  alerts,
  onToggleMapFocus,
  isIntersectingRef,
  showResetFocus,
}) => {
  const isClickable = (alert) =>
    alert.lon &&
    alert.lat &&
    process.env.REACT_APP_IS_MAP_INTERACTIVE === "true";

  const handleAlertLocationClick = (alert, idx) => {
    if (!isClickable(alert)) {
      return;
    }
    Tracking.alertLocationClick(idx);
    onToggleMapFocus(alert);
  };

  const handleResetFocus = () => {
    onToggleMapFocus("reset");
  };

  return (
    <div ref={isIntersectingRef} className="container">
      <h2>{"Most recent alerts"}</h2>

      <div className={alerts.length <= 15 ? "list" : "list scrollable"}>
        {alerts.map((alert, idx) => (
          <FadeIn show={true} key={`${alert.name}_${alert.timeStamp}_${idx}`}>
            <Row justify="center">
              <Col className="textRight" xs={10} md={10}>
                <FormattedAlertTime timeStamp={alert.timeStamp} />
              </Col>
              <Col className="textLeft" xs={12} md={12}>
                <span
                  className={isClickable(alert) ? "location" : ""}
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
        <div className="showAll" onClick={handleResetFocus}>
          Show All
        </div>
      )}
      <div style={{ marginTop: "2em", fontSize: "0.7em" }}>
        Areas without markers indicate locations of alerts 24 to 48 hours ago.
      </div>
    </div>
  );
};

MostRecentAlerts.propTypes = {
  alerts: PropTypes.array.isRequired,
  onToggleMapFocus: PropTypes.func,
  showResetFocus: PropTypes.bool.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(MostRecentAlerts, "MostRecentAlerts");
