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
  getDistanceByTimeToShelter = (timeToShelter) => {
    // https://upload.wikimedia.org/wikipedia/commons/d/d3/%D7%98%D7%95%D7%95%D7%97_%D7%99%D7%A8%D7%99_%D7%94%D7%A8%D7%A7%D7%98%D7%95%D7%AA_%D7%9E%D7%A8%D7%A6%D7%95%D7%A2%D7%AA_%D7%A2%D7%96%D7%94.png
    const TIME_TO_DISTANCE = {
      0: 1,
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
      1: 14,
      10: 11,
      20: 10,
      30: 9.5,
      40: 9,
      50: 8.5,
      120: 7.5,
    };
    return RANGE_TO_ZOOM_VALUE[distance];
  };

  isGeolocationAvailable = () => (!navigator?.geolocation ? true : false);

  componentDidMount() {
    if (this.isGeolocationAvailable()) {
      this.initMapWithUserLocation();
    } else {
      console.log("no");
    }
  }

  async initMapWithUserLocation() {
    //GO over all of the alerts!
    // add logic for 0 seconds!
    const mostRecentAlert = this.props.alerts[0];
    if (mostRecentAlert.countdownSec === null) {
      return;
    }

    const { Map } = await window.google.maps.importLibrary("maps");
    const { AdvancedMarkerElement } = await window.google.maps.importLibrary(
      "marker"
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        const alertDistance = this.getDistanceByTimeToShelter(
          mostRecentAlert.countdownSec
        );

        let map = new Map(document.getElementById("map2"), {
          center: pos,
          zoom: this.getMapZoomByDistance(alertDistance),
          disableDefaultUI: true,
          mapId: "9690ba56c9bee260",
        });

        new AdvancedMarkerElement({
          map,
          position: pos,
        });
        map.setCenter(pos);

        new window.google.maps.Circle({
          strokeColor: "#FF0000",
          strokeOpacity: 0.7,
          strokeWeight: 2,
          fillColor: "#FF0000",
          fillOpacity: 0.3,
          map,
          center: pos,
          radius: alertDistance * 1000,
        });

        this.setState({
          showMapWithUserLocation: true,
          timeToShelterText: `You have ${mostRecentAlert.countdownSec} seconds to get to shelter!`,
          alertExplanationText: `If this was happening in your area, this means a rocket targeting you was shot roughly ${alertDistance} km (${this.KMToMiles(
            alertDistance
          )} miles) away`,
          timeToShelterShareText: `I'd have ${mostRecentAlert.countdownSec} seconds to get to shelter!`,
          alertExplanationShareText: `If this was happening in MY area, this means a rocket targeting ME would've been shot roughly ${alertDistance} km (${this.KMToMiles(
            alertDistance
          )} miles) away`,
        });
      },
      () => {
        console.log("Error getting geolocation position");
        this.setState({ showMapWithUserLocation: false });
      }
    );
  }

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
            <p>
              Location services is disabled. Enable it for better experience.
            </p>
          </div>
        )}
        <div
          id="map2"
          style={{
            height: this.state.showMapWithUserLocation ? "65vh" : "0vh",
          }}
        ></div>
      </section>
    );
  }
}

export default UserLocationMap;
