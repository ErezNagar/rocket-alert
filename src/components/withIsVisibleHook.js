import React, { useEffect, useRef } from "react";
import PropTypes from "prop-types";
import Utilities from "../utilities/utilities";
import Tracking from "../tracking";

const withIsVisibleHook = (Component, componentName) => (props) => {
  const ref = useRef();
  const isVisible = Utilities.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent(componentName);
    }
  }, [isVisible]);

  return <Component {...props} isIntersectingRef={ref} />;
};

withIsVisibleHook.propTypes = {
  Component: PropTypes.elementType.isRequired,
};

export default withIsVisibleHook;
