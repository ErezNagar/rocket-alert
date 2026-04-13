import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { loadPolygons } from "../polygonService";
import MostRecentAlertsMap from "./MostRecentAlertsMap";
import withIsVisibleHook from "./withIsVisibleHook";

const MostRecentAlertsMapContainer = ({
  alerts48HrsAgo,
  mostRecentAlerts,
  mapFocus,
  isIntersectingRef,
}) => {
  const [polygons, setPolygons] = useState({});
  const shouldShowInteractiveMap = true;

  useEffect(() => {
    loadPolygons().then(setPolygons);
  }, []);

  return (
    <section ref={isIntersectingRef} className="section map">
      {shouldShowInteractiveMap && (
        <MostRecentAlertsMap
          alerts48HrsAgo={alerts48HrsAgo}
          mostRecentAlerts={mostRecentAlerts}
          polygons={polygons}
          mapFocus={mapFocus}
        />
      )}
    </section>
  );
};

MostRecentAlertsMapContainer.propTypes = {
  alerts48HrsAgo: PropTypes.array.isRequired,
  mostRecentAlerts: PropTypes.array.isRequired,
  mapFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

MostRecentAlertsMapContainer.defaultProps = {
  mapFocus: null,
};

export default withIsVisibleHook(MostRecentAlertsMapContainer, "MostRecentAlertsMapContainer");
