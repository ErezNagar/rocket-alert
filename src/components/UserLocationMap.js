import React from "react";
import Tracking from "../tracking";
import Util from "../util";

class UserLocationMap extends React.Component {
  state = {
    showMapWithUserLocation: false,
  };

  metersToPixelsAtMaxZoom = (meters, latitude) =>
    meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

  getMapZoomByDistance = (distance) => {
    const RANGE_TO_ZOOM_VALUE = {
      5: 11.25,
      10: 10.25,
      20: 9.125,
      30: 8.5,
      40: 8,
      50: 7.5,
      120: 6.5,
    };
    return RANGE_TO_ZOOM_VALUE[distance];
  };

  isGeolocationAvailable = () => (navigator?.geolocation ? true : false);

  componentDidMount() {
    if (this.isGeolocationAvailable()) {
      this.initMapWithUserLocation();
    }
  }

  async initMapWithUserLocation() {
    // Filters alerts with countdown data and use the first one
    const alertsWithCountdown = this.props.alerts?.filter(
      (alert) => alert.countdownSec === 0 || alert.countdownSec > 0
    );
    if (alertsWithCountdown.length === 0) {
      return;
    }
    const alert = alertsWithCountdown[0];

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // This needs to be first for Mapbox to render properly
        this.setState({
          showMapWithUserLocation: true,
        });
        const pos = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        const alertDistance = Util.getDistanceByTimeToShelter(
          alert.countdownSec
        );

        window.mapboxgl.accessToken =
          process.env.REACT_APP_MAPBOX_ACCESS_TOKEN_USER_LOCATION;
        const map = new window.mapboxgl.Map({
          container: "user_location_map",
          style: "mapbox://styles/mapbox/dark-v11",
          center: [pos.lon, pos.lat],
          zoom: this.getMapZoomByDistance(alertDistance),
          cooperativeGestures: true,
        });

        map.scrollZoom.disable();

        map.on("load", () => {
          // Add a marker
          const el = document.createElement("div");
          el.className = "map-marker";
          new window.mapboxgl.Marker(el)
            .setLngLat([pos.lon, pos.lat])
            .addTo(map);

          map.addSource("location_circle", {
            type: "geojson",
            data: {
              type: "FeatureCollection",
              features: [
                {
                  type: "Feature",
                  geometry: {
                    type: "Point",
                    coordinates: [pos.lon, pos.lat],
                  },
                },
              ],
            },
          });

          map.addLayer({
            id: "circle",
            type: "circle",
            source: "location_circle",
            paint: {
              "circle-radius": {
                stops: [
                  [0, 0],
                  [
                    20,
                    this.metersToPixelsAtMaxZoom(alertDistance * 1000, pos.lat),
                  ],
                ],
                base: 2,
              },
              "circle-color": "#FF0000",
              "circle-opacity": 0.3,
            },
          });
        });

        Tracking.userLocationMapLoadedEvent();
      },
      () => {
        console.log("Error getting geolocation position");
        this.setState({ showMapWithUserLocation: false });
      }
    );
  }

  render() {
    return this.state.showMapWithUserLocation ? (
      <section className="section map">
        <div
          id="user_location_map"
          style={{
            height: this.state.showMapWithUserLocation ? "65vh" : "0vh",
          }}
        ></div>
      </section>
    ) : (
      <></>
    );
  }
}

export default UserLocationMap;
