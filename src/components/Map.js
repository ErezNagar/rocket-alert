import React from "react";
import polygons from "../polygons.json";

class Map extends React.Component {
  componentDidMount() {
    this.initMap();
  }

  initMap = () => {
    this.initMapWithAlertLocation();
  };

  async initMapWithAlertLocation() {
    const { Map } = await window.google.maps.importLibrary("maps");
    const map = new Map(document.getElementById("map"), {
      disableDefaultUI: true,
      mapId: "9690ba56c9bee260",
    });
    const bounds = new window.google.maps.LatLngBounds();

    const processedIDs = [];
    this.props.alerts.forEach((alert) => {
      if (
        processedIDs.includes(alert.name) ||
        !alert.lat ||
        !alert.lon ||
        alert.englishName === "Gaya"
      ) {
        return;
      }
      processedIDs.push(alert.name);

      bounds.extend(new window.google.maps.LatLng(alert.lat, alert.lon));

      // Collect alert coordinates
      const coords = polygons[alert.taCityId]?.map(([lat, lng]) => {
        const point = new window.google.maps.LatLng(lat, lng);
        bounds.extend(point);
        return point;
      });

      // Set alert polygon
      const polygon = new window.google.maps.Polygon({
        paths: coords,
        strokeColor: "#FF0000",
        strokeOpacity: 0.7,
        strokeWeight: 2,
        fillColor: "#FF0000",
        fillOpacity: 0.3,
      });
      polygon.setMap(map);

      // Set alert marker
      new window.google.maps.Marker({
        position: new window.google.maps.LatLng(alert.lat, alert.lon),
        map: map,
        title: alert.englishName || alert.name,
      });
    });
    map.fitBounds(bounds);
  }

  render() {
    return (
      <section className="section map">
        <div id="map" style={{ height: "80vh" }}></div>
      </section>
    );
  }
}

export default Map;
