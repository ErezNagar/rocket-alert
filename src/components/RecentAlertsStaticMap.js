import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import polyline from "@mapbox/polyline";

const MAX_MAP_REQ_LENGTH = 8192;
const BASE_URL = "https://api.mapbox.com/styles/v1/mapbox/dark-v11/static";

const RecentAlertsStaticMap = ({ alerts, polygons }) => {
  const [mapImageSrc, setMapImageSrc] = useState("");
  const containerRef = useRef(null);

  useEffect(() => {
    const height = containerRef?.current.clientHeight;
    const width = containerRef?.current.clientWidth;

    const alertNames = [];
    const overlays = [];
    const markers = [];
    alerts.forEach((alert) => {
      if (alertNames.includes(alert.name)) {
        return;
      }
      alertNames.push(alert.name);

      // Build polygons
      const polygon = polygons[alert?.taCityId];
      if (!polygon) {
        return;
      }
      const overlay = encodeURIComponent(polyline.encode(polygon));
      overlays.push(`path-1+FF0000+FF0000(${overlay})`);

      // Build markers
      if (!alert.lon && !alert.lat) {
        return;
      }
      markers.push(`pin-s+EA4335(${alert.lon},${alert.lat})`);

      const overlayString = overlays.join();
      const markerString = markers.join();
      const url = `${BASE_URL}/${overlayString},${markerString}/auto/${width}x${height}@2x?padding=50&access_token=${process.env.REACT_APP_MAP_ALERT_LOCATION_TOKEN}`;
      if (url.length > MAX_MAP_REQ_LENGTH) {
        overlays.pop();
        markers.pop();
      }
    });

    const overlayString = overlays.join();
    const markerString = markers.join();
    const url = `${BASE_URL}/${overlayString},${markerString}/auto/${width}x${height}@2x?padding=50&access_token=${process.env.REACT_APP_MAP_ALERT_LOCATION_TOKEN}`;
    setMapImageSrc(url);
  }, [alerts, polygons]);

  return (
    <div ref={containerRef} style={{ height: "80vh" }}>
      <img
        alt="alert map"
        style={{
          height: "100%",
          width: "100%",
        }}
        src={mapImageSrc}
      />
    </div>
  );
};

RecentAlertsStaticMap.propTypes = {
  alerts: PropTypes.array.isRequired,
  polygons: PropTypes.object,
};

RecentAlertsStaticMap.defaultProps = {
  polygons: {},
};

export default RecentAlertsStaticMap;
