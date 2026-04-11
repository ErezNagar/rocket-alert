import PropTypes from "prop-types";
import FadeInOut from "../FadeInOut";
import Utilities from "../../utilities/utilities";

const AlertModeHeaderHero = ({ shouldRefresh, alert }) => (
  <>
    <h3>{Utilities.getAlertTypeText(alert)}</h3>
    <div className="alert">
      {Array.isArray(alert) ? (
        <FadeInOut show={shouldRefresh}>
          {alert.map((alert) => alert.englishName || alert.name).join(", ")}
        </FadeInOut>
      ) : (
        <FadeInOut show={shouldRefresh}>
          {alert.englishName || alert.name}
        </FadeInOut>
      )}
    </div>
  </>
);

AlertModeHeaderHero.propTypes = {
  shouldRefresh: PropTypes.bool,
  alert: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
};
AlertModeHeaderHero.defaultProps = {
  shouldRefresh: false,
  alert: {},
};

export default AlertModeHeaderHero;
