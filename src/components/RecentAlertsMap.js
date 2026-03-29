import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loadPolygons } from "../polygonService";
import RecentAlertsInteractiveMap from "./RecentAlertsInteractiveMap";
import withIsVisibleHook from "./withIsVisibleHook";

const RecentAlertsMap = ({
  alerts48HrsAgo,
  mostRecentAlerts,
  mapFocus,
  isIntersectingRef,
}) => {
  const [polygons, setPolygons] = useState({});
  const shouldShowInteractiveMap =
    process.env.REACT_APP_IS_MAP_INTERACTIVE === "true";

  useEffect(() => {
    loadPolygons().then(setPolygons);
  }, []);

  return (
    <section ref={isIntersectingRef} className="section map">
      {shouldShowInteractiveMap && (
        <RecentAlertsInteractiveMap
          alerts48HrsAgo={alerts48HrsAgo}
          mostRecentAlerts={mostRecentAlerts}
          polygons={polygons}
          mapFocus={mapFocus}
        />
      )}
    </section>
  );
};

RecentAlertsMap.propTypes = {
  alerts48HrsAgo: PropTypes.array.isRequired,
  mostRecentAlerts: PropTypes.array.isRequired,
  mapFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

RecentAlertsMap.defaultProps = {
  mapFocus: null,
};

export default withIsVisibleHook(RecentAlertsMap, "RecentAlertsMap");
