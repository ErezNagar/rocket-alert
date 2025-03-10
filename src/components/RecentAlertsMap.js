import React from "react";
import PropTypes from "prop-types";
import Cache from "../cache";
import Tracking from "../tracking";
import Util from "../util";
import RecentAlertsStaticMap from "./RecentAlertsStaticMap";
import RecentAlertsInteractiveMap from "./RecentAlertsInteractiveMap";
import withIsVisibleHook from "./withIsVisibleHook";

class RecentAlertsMap extends React.Component {
  constructor(props) {
    super(props);
    this.staticMapContainerRef = React.createRef();
  }

  state = {
    shouldShowInteractiveMap:
      process.env.REACT_APP_IS_MAP_INTERACTIVE === "true",
    shouldShowStaticMap: process.env.REACT_APP_IS_MAP_STATIC === "true",
    polygons: {},
  };

  componentDidMount() {
    this.loadPolygons();
  }

  loadPolygons = () => {
    if (Cache.canUseCache()) {
      this.loadPolygonsFromCache();
    } else {
      Tracking.polygonCache("cant_use_cache");
      this.loadPolygonsFromFile().then((json) => {
        this.setState({ polygons: json });
      });
    }
  };

  loadPolygonsFromCache = () => {
    let polygons;
    if ((polygons = Cache.getJSON("polygons")) === null) {
      Tracking.polygonCache("miss");
      this.loadPolygonsFromFile().then((json) => {
        polygons = json;
        this.setState({ polygons });
        this.setPolygonsToCache(polygons);
      });
    } else {
      if (Cache.get(Util.POLYGON_VERSION_KEY) === Util.POLYGON_VERSION_VALUE) {
        Tracking.polygonCache("hit");
        this.setState({ polygons });
      } else {
        Tracking.polygonCache("older_version");
        this.loadPolygonsFromFile().then((json) => {
          polygons = json;
          this.setState({ polygons });
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

  render() {
    return (
      <section ref={this.props.isIntersectingRef} className="section map">
        {this.state.shouldShowInteractiveMap && (
          <RecentAlertsInteractiveMap
            alerts={this.props.alerts}
            polygons={this.state.polygons}
            mapFocus={this.props.mapFocus}
          />
        )}
        {this.state.shouldShowStaticMap && (
          <RecentAlertsStaticMap
            alerts={this.props.alerts}
            polygons={this.state.polygons}
          />
        )}
      </section>
    );
  }
}

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
