import React from "react";
import "./App.css";
import Header from "./components/Header";
import AlertModeHeader from "./components/AlertModeHeader";
import StickyHeader from "./components/StickyHeader";
import AlertModeStickyHeader from "./components/AlertModeStickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import PreviousStats from "./components/PreviousStats";
import Map from "./components/Map";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import AlertClient from "./rocket_alert_client";
import RealTimeAlertManager from "./realtime_alert_manager";
import queryString from "query-string";
import { getYesterday } from "./date_helper";
import wretch from "wretch";

class App extends React.Component {
  state = {
    alerts: {},
    showStickyHeader: false,
    startfadeInEffect: false,
    isAlertMode: false,
    realTimeAlert: null,
  };

  alertEventSource = null;

  /*
   * Returns whether the app is in Alert mode.
   * App is in Alert mode when there are active, real-time, alerts,
   * or when using mode=alert queryString in dev
   */
  isAppInAlertMode = () => {
    const query = queryString.parse(window.location.search);
    const queryKeys = Object.keys(query);
    if (queryKeys.length !== 1) {
      return false;
    }
    return queryKeys[0].toLowerCase() === "mode" &&
      query[queryKeys[0]] === "alert"
      ? true
      : false;
  };

  componentDidMount() {
    this.setRealTimeAlerts();

    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      startfadeInEffect: true,
      isAlertMode: this.isAppInAlertMode(),
    });
  }

  setRealTimeAlerts = () => {
    RealTimeAlertManager.setRealTimeAlerts(AlertClient, (alert) => {
      // console.log("alert", JSON.parse(alert).timeStamp);
      console.log("alert", alert);
      // this.setState({ realTimeAlert: JSON.parse(alert) });
    });

    // Mock incoming alerts by hitting the server
    // setInterval(() => {
    //   wretch(
    //     "https://ra-agg.kipodopik.com/api/v1/alerts/real-time?token=BHHWEIP221a547&data=test1,test2"
    //     // "https://ra-agg.kipodopik.com/api/v1/alerts/real-time?token=BHHWEIP221a547&data=test1"
    //   )
    //     .post()
    //     .res()
    //     .catch((e) => console.log("e", e));
    // }, 250);
  };

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    RealTimeAlertManager.stopRealTimeAlerts();
  }

  handleScroll = (e) => {
    const vh80 = window.innerHeight * 0.8;
    this.setState({
      showStickyHeader: window.scrollY > Math.floor(vh80) ? true : false,
    });
  };

  render() {
    return (
      <div
        className={
          this.state.startfadeInEffect
            ? "pageContainer active"
            : "pageContainer"
        }
      >
        {this.state.isAlertMode ? (
          <AlertModeHeader
            getYesterday={getYesterday}
            alertClient={AlertClient}
          />
        ) : (
          <Header getYesterday={getYesterday} alertClient={AlertClient} />
        )}
        {this.state.showStickyHeader && this.state.isAlertMode && (
          <AlertModeStickyHeader realTimeAlert={this.state.realTimeAlert} />
        )}
        {this.state.showStickyHeader && !this.state.isAlertMode && (
          <StickyHeader />
        )}

        <PreviousStats alertsClient={AlertClient} />
        <Map />
        {/* Are these actually "verified" or official as for rocket launch (not alerts) data? */}
        <PreviousOperations alertsClient={AlertClient} />
        <FAQ />
        <Footer />
      </div>
    );
  }
}

export default App;
