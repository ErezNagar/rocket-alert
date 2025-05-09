import PropTypes from "prop-types";
import FadeInOut from "../FadeInOut";
import Util from "../../util";

const AlertModeHeaderHero = ({ shouldRefresh, alert }) => (
  <>
    <h3>{Util.getAlertTypeText(alert)}</h3>
    <div className="alert">
      <FadeInOut show={shouldRefresh}>
        {alert.englishName || alert.name}
      </FadeInOut>
    </div>
  </>
);

AlertModeHeaderHero.propTypes = {
  shouldRefresh: PropTypes.bool,
  alert: PropTypes.object,
};
AlertModeHeaderHero.defaultProps = {
  shouldRefresh: false,
  alert: {},
};

export default AlertModeHeaderHero;
