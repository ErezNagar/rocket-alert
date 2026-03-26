import React from "react";
import PropTypes from "prop-types";
import MAP_STYLE from "../mapStyle";
import Utilities from "../utilities/utilities";

class RecentAlertsInteractiveMap extends React.Component {
  state = {
    map: null,
    mapBounds: null,
    allRenderedLocations: [],
  };

  MAP_PADDING = { top: 50, bottom: 50, left: 50, right: 50 };

  componentDidMount() {
    this.initMapWithAlertLocation();
  }

  componentDidUpdate(prevProps) {
    const prevAlert = prevProps.mostRecentAlerts?.[0];
    const currentAlert = this.props.mostRecentAlerts?.[0];

    if (currentAlert && prevAlert?.name !== currentAlert.name) {
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
    const renderedLocationsInBatch = [];
    const bounds = new window.maplibregl.LngLatBounds();

    alerts.forEach((alert) => {
      // Skip locations that are already rendered
      if (
        renderedLocationsInBatch.includes(alert.name) ||
        this.state.allRenderedLocations.includes(alert.name)
      ) {
        return;
      }
      renderedLocationsInBatch.push(alert.name);
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
          el.className = "map-marker-orange";
        }
        new window.maplibregl.Marker({ element: el, anchor: "bottom" })
          .setLngLat([alert.lon, alert.lat])
          .addTo(map);
      }
    });

    this.setState({
      allRenderedLocations: [
        ...this.state.allRenderedLocations,
        ...renderedLocationsInBatch,
      ],
    });

    return bounds;
  };

  addFillLayer = (map, id, source, fillColor) => {
    map.addLayer({
      id,
      type: "fill",
      source: {
        type: "geojson",
        data: source,
      },
      paint: {
        "fill-color": fillColor,
        "fill-opacity": 0.3,
      },
    });
  };

  addLineLayer = (map, id, source, lineColor) => {
    map.addLayer({
      id,
      type: "line",
      source: {
        type: "geojson",
        data: source,
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

    // Add polygons fill and outline layers for recent alerts
    this.addFillLayer(map, "p-f-recent-rockets", geojsonRecentRockets, "red");
    this.addFillLayer(map, "p-f-recent-uavs", geojsonRecentUAVs, "#EAA365");
    this.addLineLayer(map, "p-l-recent-rockets", geojsonRecentRockets, "red");
    this.addLineLayer(map, "p-l-recent-uavs", geojsonRecentUAVs, "#EAA365");

    // Add polygons fill and outline layers for 48hrs alerts
    this.addFillLayer(map, "p-f-48hrs-rockets", geojson48HrsRockets, "#7f0000");
    this.addFillLayer(map, "p-f-48hrs-uavs", geojson48HrsUAVs, "#a87548");
    this.addLineLayer(map, "p-l-48hrs-rockets", geojson48HrsRockets, "#7f0000");
    this.addLineLayer(map, "p-l-48hrs-uavs", geojson48HrsUAVs, "#a87548");

    const overallBounds = bounds1.extend(bounds2);
    map.fitBounds(overallBounds, {
      padding: this.MAP_PADDING,
      animate: false,
    });

    this.setState({ map, mapBounds: overallBounds });
  };

  updateMap = (map) => {
    if (!map) {
      return;
    }
    const geojsonRockets = {
      type: "FeatureCollection",
      features: [],
    };
    const geojsonUAVs = {
      type: "FeatureCollection",
      features: [],
    };

    const bounds = this.drawMapMarkersAndPolygons(
      map,
      geojsonRockets,
      geojsonUAVs,
      this.props.mostRecentAlerts,
    );

    const id1 = `${Math.random().toString(36)}`;
    const id2 = `${Math.random().toString(36)}`;
    map.addSource(id1, {
      type: "geojson",
      data: geojsonRockets,
    });
    map.addSource(id2, {
      type: "geojson",
      data: geojsonUAVs,
    });

    // Add a layer to visualize polygons.
    this.addFillLayer(map, `p-f-rt-rockets-${id1}`, geojsonRockets, "red");
    this.addFillLayer(map, `p-f-rt-uavs-${id2}`, geojsonUAVs, "#EAA365");

    // Add an outline around polygons.
    this.addLineLayer(map, `p-l-rt-rockets-${id1}`, geojsonRockets, "red");
    this.addLineLayer(map, `p-l-rt-uavs-${id2}`, geojsonUAVs, "#EAA365");

    // const overallBounds = bounds1.extend(bounds2);

    const newBounds = this.state.mapBounds.extend(bounds);

    map.fitBounds(newBounds, {
      padding: this.MAP_PADDING,
      animate: true,
    });

    this.setState({ map, mapBounds: newBounds });
  };

  updateMapFocus = () => {
    const alert = this.props.mapFocus;
    if (alert === "reset") {
      this.state.map.fitBounds(this.state.mapBounds, {
        padding: this.MAP_PADDING,
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
