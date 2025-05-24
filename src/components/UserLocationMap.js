import React, { useState, useEffect, useCallback } from "react";
import Tracking from "../tracking";
import Utilities from "../utilities/utilities";

const UserLocationMap = ({ alerts }) => {
  const [showMap, setShowMap] = useState(false);

  const metersToPixelsAtMaxZoom = (meters, latitude) =>
    meters / 0.075 / Math.cos((latitude * Math.PI) / 180);

  const getMapZoomByDistance = (distance) => {
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

  const isGeolocationAvailable = () => (navigator?.geolocation ? true : false);

  const initMapWithUserLocation = useCallback(() => {
    // Filters alerts with countdown data and use the first one
    const alertsWithCountdown = alerts?.filter(
      (alert) => alert.countdownSec === 0 || alert.countdownSec > 0
    );
    if (alertsWithCountdown.length === 0) {
      return;
    }
    const alert = alertsWithCountdown[0];

    navigator.geolocation.getCurrentPosition(
      (position) => {
        // This needs to be first for Mapbox to render properly
        setShowMap(true);
        const pos = {
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        };
        const alertDistance = Utilities.getDistanceByTimeToShelter(
          alert.countdownSec
        );

        window.mapboxgl.accessToken =
          process.env.REACT_APP_MAP_USER_LOCATION_TOKEN;
        const map = new window.mapboxgl.Map({
          container: "user_location_map",
          style: "mapbox://styles/mapbox/dark-v11",
          center: [pos.lon, pos.lat],
          zoom: getMapZoomByDistance(alertDistance),
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
                  [20, metersToPixelsAtMaxZoom(alertDistance * 1000, pos.lat)],
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
        setShowMap(false);
      }
    );
  }, [alerts]);

  useEffect(() => {
    if (isGeolocationAvailable()) {
      initMapWithUserLocation();
    }
  }, [initMapWithUserLocation]);

  return (
    <>
      {showMap && (
        <section className="section map">
          <div
            id="user_location_map"
            style={{
              height: showMap ? "65vh" : "0vh",
            }}
          ></div>
        </section>
      )}
    </>
  );
};

export default UserLocationMap;
