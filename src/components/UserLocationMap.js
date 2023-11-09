import React from "react";
import { TwitterOutlined } from "@ant-design/icons";

class UserLocationMap extends React.Component {
  state = {
    showMapWithUserLocation: false,
    timeToShelterText: "",
    timeToShelterShareText: "",
    alertExplanationText: "",
    alertExplanationShareText: "",
  };

  KMToMiles = (km) => Math.round(km * 0.621371 * 10) / 10;

  metersToPixelsAtMaxZoom = (meters, latitude) =>
    meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

  /*
    Returns approx. distance from Gaza in KM based on
    the number of seconds there are to find shelter
  */
  getDistanceByTimeToShelter = (timeToShelter) => {
    // https://upload.wikimedia.org/wikipedia/commons/d/d3/%D7%98%D7%95%D7%95%D7%97_%D7%99%D7%A8%D7%99_%D7%94%D7%A8%D7%A7%D7%98%D7%95%D7%AA_%D7%9E%D7%A8%D7%A6%D7%95%D7%A2%D7%AA_%D7%A2%D7%96%D7%94.png
    const TIME_TO_DISTANCE = {
      0: 5,
      15: 10,
      30: 20,
      45: 30,
      60: 40,
      90: 50,
      180: 120,
    };
    return TIME_TO_DISTANCE[timeToShelter];
  };
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
        const alertDistance = this.getDistanceByTimeToShelter(
          alert.countdownSec
        );

        window.mapboxgl.accessToken =
          "pk.eyJ1IjoiZXJlem5hZ2FyIiwiYSI6ImNsb2xuOTRzZjB5b3oycW1vN3l3dzF4YjIifQ.lR0mx9Q4okPC_yUCkdJ6Sw";
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

        this.setAlertTextExplanation(alertDistance, alert.countdownSec);
      },
      () => {
        console.log("Error getting geolocation position");
        this.setState({ showMapWithUserLocation: false });
      }
    );
  }

  setAlertTextExplanation = (alertDistance, timeToShelter) => {
    const timeToShelterText =
      alertDistance > 5
        ? `You have ${timeToShelter} seconds to get to shelter!`
        : `Get to shelter immediately!`;

    const alertExplanationText =
      alertDistance > 5
        ? `If this was happening in your area, this means a rocket targeting you was shot roughly ${alertDistance} km (${this.KMToMiles(
            alertDistance
          )} miles) away`
        : `If this was happening in your area, this means a rocket targeting you was shot less than 5 km (${this.KMToMiles(
            alertDistance
          )} miles) away`;

    const timeToShelterShareText =
      alertDistance > 5
        ? `I'd have ${timeToShelter} seconds to get to shelter!`
        : `I'd have to get to shelter immediately!`;

    const alertExplanationShareText =
      alertDistance > 5
        ? `If this was happening in MY area, this means a rocket targeting me would've been shot roughly ${alertDistance} km (${this.KMToMiles(
            alertDistance
          )} miles) away`
        : `If this was happening in MY area, this means a rocket targeting me would've been shot less than 5 km (${this.KMToMiles(
            alertDistance
          )} miles) away`;

    this.setState({
      showMapWithUserLocation: true,
      timeToShelterText,
      alertExplanationText,
      timeToShelterShareText,
      alertExplanationShareText,
    });
  };

  render() {
    return (
      <section className="section map">
        {this.state.showMapWithUserLocation ? (
          <div className="mapText">
            <h2>{this.state?.timeToShelterText}</h2>
            <h3>{this.state?.alertExplanationText}</h3>
            <p>Based on the last rocket alert and your location</p>
            <div>
              <a
                href={`https://twitter.com/share?text=${this.state?.timeToShelterShareText} ${this.state?.alertExplanationShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                target="_blank"
                rel="noreferrer"
                style={{ color: "black" }}
              >
                <TwitterOutlined style={{ fontSize: "30px", color: "black" }} />
              </a>
              <div>
                <a
                  style={{ color: "black" }}
                  href={`https://twitter.com/share?text=${this.state?.timeToShelterShareText} ${this.state?.alertExplanationShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                  target="_blank"
                  rel="noreferrer"
                >
                  Share this
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="mapText">
            <h2>How much time would you have to get to shelter?</h2>
            <p className="enable-location">
              Find out by enabling location services
            </p>
          </div>
        )}
        <div
          id="user_location_map"
          style={{
            height: this.state.showMapWithUserLocation ? "65vh" : "0vh",
          }}
        ></div>
      </section>
    );
  }
}

export default UserLocationMap;
