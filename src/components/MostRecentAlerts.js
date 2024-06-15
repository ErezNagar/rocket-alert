import PropTypes from "prop-types";
import { useState } from "react";
import { Row, Col } from "antd";
import FormattedAlertTime from "./FormattedAlertTime";
import FadeIn from "./FadeIn";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";
import { withTranslation } from "react-i18next";

const MostRecentAlerts = ({ t, alerts, onAlertLocationClick, isIntersectingRef }) => {
  const [showResetFocus, setShowResetFocus] = useState(false);

  const handleAlertLocationClick = (alert, idx) => {
    Tracking.alertLocationClick(idx);
    setShowResetFocus(true);
    onAlertLocationClick(alert);
  };

  const handleResetFocus = () => {
    setShowResetFocus(false);
    onAlertLocationClick("reset");
  };

  return (
    <div ref={isIntersectingRef} className="container">
      <h2>{t("most_recent_alerts.title")}</h2>
      {alerts.map((alert, idx) => (
        <FadeIn show={true} key={`${alert.name}_${alert.timeStamp}_${idx}`}>
          <Row justify="center">
            <Col className="textRight" xs={10} md={10}>
              <FormattedAlertTime timeStamp={alert.timeStamp} />
            </Col>
            <Col className="textLeft" xs={12} md={12}>
              <span
                className="location"
                onClick={() => handleAlertLocationClick(alert, idx)}
              >
                {alert.englishName || alert.name}
              </span>
            </Col>
          </Row>
        </FadeIn>
      ))}
      {showResetFocus && (
        <div className="showAll" onClick={handleResetFocus}>
          {t("most_recent_alerts.show_all")}
        </div>
      )}
    </div>
  );
};

MostRecentAlerts.propTypes = {
  alerts: PropTypes.array.isRequired,
  onAlertLocationClick: PropTypes.func,
  isIntersectingRef: PropTypes.object.isRequired,
};

MostRecentAlerts.defaultProps = {
  onAlertLocationClick: () => {},
};

export default withIsVisibleHook(withTranslation()(MostRecentAlerts), "MostRecentAlerts");
