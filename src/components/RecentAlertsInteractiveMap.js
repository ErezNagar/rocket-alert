import React from "react";
import PropTypes from "prop-types";
import MAP_STYLE from "../mapStyle";
import Utilities from "../utilities/utilities";

class RecentAlertsInteractiveMap extends React.Component {
  state = {
    map: null,
    mapBounds: null,
  };

  componentDidMount() {
    this.initMapWithAlertLocation();
  }

  componentDidUpdate(prevProps) {
    if (
      prevProps.mostRecentAlerts?.length > 0 &&
      this.props.mostRecentAlerts?.length > 0 &&
      prevProps.mostRecentAlerts[0].name !== this.props.mostRecentAlerts[0].name
    ) {
      this.updateMap(this.state.map);
    }

    if (this.props.mapFocus) {
      this.updateMapFocus();
    }
  }

  getCenterMap = (mostRecentAlerts, alerts48HrsAgo) => {
    const DEFAULT_CENTER = [31.7683, 35.2433]; // Jerusalem
    if (!mostRecentAlerts || !alerts48HrsAgo) {
      return DEFAULT_CENTER;
    }

    // Center of map should be based on most recent alert
    let center = [...DEFAULT_CENTER];
    if (mostRecentAlerts.length > 0) {
      center = [mostRecentAlerts[0].lon, mostRecentAlerts[0].lat];
    } else if (alerts48HrsAgo.length > 0) {
      center = [alerts48HrsAgo[0].lon, alerts48HrsAgo[0].lat];
    }

    if (!center[0] || !center[1]) {
      return DEFAULT_CENTER;
    }
    return center;
  };

  async initMapWithAlertLocation() {
    const map = new window.maplibregl.Map({
      container: "alerts_map",
      style: MAP_STYLE,
      center: this.getCenterMap(),
      cooperativeGestures: true,
      attributionControl: false,
    }).addControl(
      new window.maplibregl.AttributionControl({
        compact: true,
      }),
    );

    map.on("load", () => {
      this.initMap(map);
    });
  }

  addGeoJsonFeature = (geojson, alert) => {
    geojson.features.push({
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          this.props.polygons[alert.taCityId]?.map(([lat, lon]) => [lon, lat]),
        ],
      },
    });
  };

  drawMapMarkersAndPolygons = (
    map,
    geojsonRockets,
    geojsonUAVs,
    alerts,
    shouldAddMarkers = true,
  ) => {
    const alertNames = [];
    const bounds = new window.maplibregl.LngLatBounds();

    alerts.forEach((alert) => {
      if (alertNames.includes(alert.name)) {
        return;
      }
      alertNames.push(alert.name);

      this.props.polygons[alert.taCityId]?.forEach(([lat, lon]) => {
        bounds.extend([lon, lat]);
      });

      if (alert.taCityId) {
        if (alert.alertTypeId === Utilities.ALERT_TYPE_UAV) {
          this.addGeoJsonFeature(geojsonUAVs, alert);
        } else {
          this.addGeoJsonFeature(geojsonRockets, alert);
        }
      }

      // Add a marker
      if (shouldAddMarkers) {
        const el = document.createElement("div");
        el.className = "map-marker";
        if (alert.alertTypeId === Utilities.ALERT_TYPE_UAV) {
          el.className = "map-marker-yellow";
        }
        new window.maplibregl.Marker({ element: el })
          .setLngLat([alert.lon, alert.lat])
          .addTo(map);
      }
    });

    return bounds;
  };

  addFillLayer = (map, id, geojson, fillColor) => {
    map.addLayer({
      id,
      type: "fill",
      source: {
        type: "geojson",
        data: geojson,
      },
      paint: {
        "fill-color": fillColor,
        "fill-opacity": 0.3,
      },
    });
  };

  addLineLayer = (map, id, geojson, lineColor) => {
    map.addLayer({
      id,
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      paint: {
        "line-color": lineColor,
        "line-width": 1,
      },
    });
  };

  initMap = (map) => {
    const geojsonRecentRockets = {
      type: "FeatureCollection",
      features: [],
    };
    const geojsonRecentUAVs = {
      type: "FeatureCollection",
      features: [],
    };
    const geojson48HrsRockets = {
      type: "FeatureCollection",
      features: [],
    };
    const geojson48HrsUAVs = {
      type: "FeatureCollection",
      features: [],
    };
    const bounds1 = this.drawMapMarkersAndPolygons(
      map,
      geojsonRecentRockets,
      geojsonRecentUAVs,
      this.props.mostRecentAlerts,
    );
    const bounds2 = this.drawMapMarkersAndPolygons(
      map,
      geojson48HrsRockets,
      geojson48HrsUAVs,
      this.props.alerts48HrsAgo,
      false,
    );

    // Add a layer to visualize polygons.
    this.addFillLayer(map, "p-f-recent-rockets", geojsonRecentRockets, "red");
    this.addFillLayer(map, "p-f-recent-uavs", geojsonRecentUAVs, "#ffd400");
    this.addFillLayer(map, "p-f-48hrs-rockets", geojson48HrsRockets, "red");
    this.addFillLayer(map, "p-f-48hrs-uavs", geojson48HrsUAVs, "#ffd400");

    // Add an outline around polygons.
    this.addLineLayer(map, "p-l-recent-rockets", geojsonRecentRockets, "red");
    this.addLineLayer(map, "p-l-recent-uavs", geojsonRecentUAVs, "#ffd400");
    this.addLineLayer(map, "p-l-48hrs-rockets", geojson48HrsRockets, "red");
    this.addLineLayer(map, "p-l-48hrs-uavs", geojson48HrsUAVs, "#ffd400");

    const overallBounds = bounds1.extend(bounds2);
    map.fitBounds(overallBounds, {
      padding: { top: 50, bottom: 170, left: 50, right: 50 },
      animate: false,
    });

    this.setState({ map, mapBounds: overallBounds });
  };

  updateMap = (map) => {
    const geojson = {
      type: "FeatureCollection",
      features: [],
    };
    const bounds = this.drawMapMarkersAndPolygons(
      map,
      geojson,
      this.props.mostRecentAlerts,
    );

    map.getSource("polygon1").setData(geojson);
    map.getSource("outline1").setData(geojson);

    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 170 },
      animate: true,
    });

    this.setState({ map, mapBounds: bounds });
  };

  updateMapFocus = () => {
    const alert = this.props.mapFocus;
    if (alert === "reset") {
      this.state.map.fitBounds(this.state.mapBounds, {
        padding: { top: 50, bottom: 170 },
        pitch: 0,
        animate: true,
      });
    } else {
      this.state.map.panTo([alert.lon, alert.lat], {
        zoom: 13,
        pitch: 50,
        animate: true,
      });
    }
  };

  render() {
    return <div id="alerts_map" style={{ height: "80vh" }}></div>;
  }
}

RecentAlertsInteractiveMap.propTypes = {
  alerts48HrsAgo: PropTypes.array.isRequired,
  mostRecentAlerts: PropTypes.array.isRequired,
  mapFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
  polygons: PropTypes.object,
};

RecentAlertsInteractiveMap.defaultProps = {
  mapFocus: null,
  polygons: {},
};

export default RecentAlertsInteractiveMap;
