import React from "react";
import PropTypes from "prop-types";
import Cache from "../cache";
import Tracking from "../tracking";
import Util from "../util";
let polygons;

class RecentAlertsMap extends React.Component {
  state = {
    map: null,
    mapBounds: null,
    showMapWithUserLocation: false,
    timeToShelterText: "",
    timeToShelterShareText: "",
    alertExplanationText: "",
    alertExplanationShareText: "",
  };

  componentDidMount() {
    this.loadPolygons();
    this.initMapWithAlertLocation();
  }

  loadPolygons = () => {
    if (Cache.canUseCache()) {
      this.loadPolygonsFromCache();
    } else {
      Tracking.polygonCache("cant_use_cache");
      this.loadPolygonsFromFile().then((json) => {
        polygons = json;
      });
    }
  };

  loadPolygonsFromCache = () => {
    if ((polygons = Cache.getJSON("polygons")) === null) {
      Tracking.polygonCache("miss");
      this.loadPolygonsFromFile().then((json) => {
        polygons = json;
        this.setPolygonsToCache(polygons);
      });
    } else {
      if (Cache.get(Util.POLYGON_VERSION_KEY) === Util.POLYGON_VERSION) {
        Tracking.polygonCache("hit");
      } else {
        Tracking.polygonCache("older_version");
        this.loadPolygonsFromFile().then((newPolygons) => {
          polygons = newPolygons;
          this.setPolygonsToCache(polygons);
        });
      }
    }
  };

  setPolygonsToCache = (polygons) => {
    Cache.setJSON("polygons", polygons);
    Cache.set(Util.POLYGON_VERSION_KEY, Util.POLYGON_VERSION_VALUE);
  };

  loadPolygonsFromFile = () =>
    import("../polygons.json").then((json) => json.default || json);

  componentDidUpdate(prevProps) {
    if (prevProps.alerts[0].name !== this.props.alerts[0].name) {
      this.updateMap(this.state.map);
    }

    if (this.props.mapFocus) {
      this.updateMapFocus();
    }
  }

  async initMapWithAlertLocation() {
    window.mapboxgl.accessToken =
      process.env.REACT_APP_MAPBOX_ACCESS_TOKEN_ALERT_LOCATION;
    const map = new window.mapboxgl.Map({
      container: "alerts_map",
      style: "mapbox://styles/mapbox/dark-v11",
      center: [this.props.alerts[0].lon, this.props.alerts[0].lat],
      cooperativeGestures: true,
    });

    map.on("load", () => {
      this.initMap(map);
    });
  }

  drawMapMarkersAndPolygons = (map, geojson) => {
    const alertNames = [];
    const bounds = new window.mapboxgl.LngLatBounds();

    this.props.alerts.forEach((alert) => {
      if (alertNames.includes(alert.name)) {
        return;
      }
      alertNames.push(alert.name);

      polygons[alert.taCityId]?.forEach(([lat, lon]) => {
        bounds.extend([lon, lat]);
      });

      if (alert.taCityId) {
        geojson.features.push({
          type: "Feature",
          geometry: {
            type: "Polygon",
            coordinates: [
              polygons[alert.taCityId]?.map(([lat, lon]) => [lon, lat]),
            ],
          },
        });
      }

      // Add a marker
      const el = document.createElement("div");
      el.className = "map-marker";
      new window.mapboxgl.Marker(el)
        .setLngLat([alert.lon, alert.lat])
        .addTo(map);
    });

    return bounds;
  };

  initMap = (map) => {
    const geojson = {
      type: "FeatureCollection",
      features: [],
    };
    const bounds = this.drawMapMarkersAndPolygons(map, geojson);
    // Add a new layer to visualize the polygons.
    map.addLayer({
      id: `polygon1`,
      type: "fill",
      source: {
        type: "geojson",
        data: geojson,
      },
      paint: {
        "fill-color": "red",
        "fill-opacity": 0.3,
      },
    });

    // Add am outline around the polygon.
    map.addLayer({
      id: `outline1`,
      type: "line",
      source: {
        type: "geojson",
        data: geojson,
      },
      paint: {
        "line-color": "red",
        "line-width": 1,
      },
    });

    map.fitBounds(bounds, {
      padding: { top: 50, bottom: 170, left: 50, right: 50 },
      animate: false,
    });

    this.setState({ map, mapBounds: bounds });
  };

  updateMap = (map) => {
    const geojson = {
      type: "FeatureCollection",
      features: [],
    };
    const bounds = this.drawMapMarkersAndPolygons(map, geojson);

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
    return (
      <section className="section map">
        <div id="alerts_map" style={{ height: "80vh" }}></div>
      </section>
    );
  }
}

RecentAlertsMap.propTypes = {
  alerts: PropTypes.array.isRequired,
  mapFocus: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
};

RecentAlertsMap.defaultProps = {
  mapFocus: null,
};

export default RecentAlertsMap;
