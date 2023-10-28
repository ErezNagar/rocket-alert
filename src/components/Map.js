import React from "react";

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

      // Set marker
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
