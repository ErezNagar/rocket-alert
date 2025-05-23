import PropTypes from "prop-types";
import FadeInOut from "../FadeInOut";

const AlertModeHeaderHero = ({ advanceNotices }) => (
  <>
    <h3>Missile launches detected</h3>
    <div className="alert">
      <FadeInOut show>{advanceNotices.join(", ")}</FadeInOut>
    </div>
  </>
);

AlertModeHeaderHero.propTypes = {
  shouldRefresh: PropTypes.bool,
  advanceNotices: PropTypes.array.isRequired,
};
AlertModeHeaderHero.defaultProps = {
  shouldRefresh: false,
};

export default AlertModeHeaderHero;
