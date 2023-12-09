import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Util from "../util";
import Tracking from "../tracking";

const withIsVisibleHook = (Component) => (props) => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent(Component.name);
    }
  }, [isVisible]);

  return <Component {...props} isIntersectingRef={ref} />;
};

withIsVisibleHook.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default withIsVisibleHook;
