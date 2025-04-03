import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Cache from "../cache";
import Tracking from "../tracking";
import Util from "../util";
import RecentAlertsStaticMap from "./RecentAlertsStaticMap";
import RecentAlertsInteractiveMap from "./RecentAlertsInteractiveMap";
import withIsVisibleHook from "./withIsVisibleHook";

const RecentAlertsMap = ({ alerts, mapFocus, isIntersectingRef }) => {
  const [polygons, setPolygons] = useState({});
  const shouldShowInteractiveMap =
    process.env.REACT_APP_IS_MAP_INTERACTIVE === "true";
  const shouldShowStaticMap = process.env.REACT_APP_IS_MAP_STATIC === "true";

  const loadPolygons = () => {
    if (Cache.canUseCache()) {
      loadPolygonsFromCache();
    } else {
      Tracking.polygonCache("cant_use_cache");
      loadPolygonsFromFile();
    }
  };

  const loadPolygonsFromCache = () => {
    let polygons = Cache.getJSON("polygons");
    if (polygons) {
      if (Cache.get(Util.POLYGON_VERSION_KEY) === Util.POLYGON_VERSION_VALUE) {
        Tracking.polygonCache("hit");
        setPolygons(polygons);
      } else {
        Tracking.polygonCache("older_version");
        loadPolygonsFromFile({ setToCache: true });
      }
    } else {
      Tracking.polygonCache("miss");
      loadPolygonsFromFile({ setToCache: true });
    }
  };

  const setPolygonsToCache = (polygons) => {
    Cache.setJSON("polygons", polygons);
    Cache.set(Util.POLYGON_VERSION_KEY, Util.POLYGON_VERSION_VALUE);
  };

  const loadPolygonsFromFile = ({ setToCache }) =>
    import("../polygons.json")
      .then((json) => json.default || json)
      .then((polygons) => {
        setPolygons(polygons);
        if (setToCache) {
          setPolygonsToCache(polygons);
        }
      });

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    console.log("RecentAlertsMap mounted");
    loadPolygons();
  }, []);
  /* eslint-enable react-hooks/exhaustive-deps */

  return (
    <section ref={isIntersectingRef} className="section map">
      {shouldShowInteractiveMap && (
        <RecentAlertsInteractiveMap
          alerts={alerts}
          polygons={polygons}
          mapFocus={mapFocus}
        />
      )}
      {shouldShowStaticMap && (
        <RecentAlertsStaticMap alerts={alerts} polygons={polygons} />
      )}
    </section>
  );
};

RecentAlertsMap.propTypes = {
  alerts: PropTypes.array.isRequired,
  mapFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

RecentAlertsMap.defaultProps = {
  mapFocus: null,
};

export default withIsVisibleHook(RecentAlertsMap, "RecentAlertsMap");
