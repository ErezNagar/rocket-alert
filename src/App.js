import React from "react";
import "./App.css";
import Header from "./components/Header";
import StickyHeader from "./components/StickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import PreviousStats from "./components/PreviousStats";
// import Map from "./components/Map";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import AlertClient from "./rocket_alert_client";
import RealTimeAlertManager from "./realtime_alert_manager";
import Util from "./util";
import queryString from "query-string";
import { getYesterday } from "./date_helper";
import wretch from "wretch";

let counter = 0;
class App extends React.Component {
  state = {
    alerts: {},
    showStickyHeader: false,
    startfadeInEffect: false,
    // Whether query string alert mode param is set
    isAlertModeOverride: false,
    // Whether the app currently receives incoming alerts
    isAlertMode: false,
    // The alert boject
    realTimeAlert: null,
  };

  alertEventSource = null;

  /*
   * Checks whether the Alert Mode query string is set. Dev only.
   */
  isAlertModeQueryString = () => {
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
    this.startListeningToRealTimeAlerts();
    if (this.isAlertModeQueryString()) {
      this.mockIncomingAlerts();
    }

    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      startfadeInEffect: true,
    });
  }

  startListeningToRealTimeAlerts = () => {
    RealTimeAlertManager.startRealTimeAlerts(
      AlertClient,
      (alert, isLastAlert) => {
        if (Util.isDev()) {
          console.log("Processing alert", alert);
        }
        this.setState({
          realTimeAlert: JSON.parse(alert),
          isAlertMode: isLastAlert ? false : true,
        });
      }
    );
  };

  /*
   * Mocks incoming alerts by hitting the server.
   * Waits 2 seconds before initiating requests. After which, call the server in intervals
   */
  mockIncomingAlerts = () => {
    setInterval(() => {
      wretch(
        // `https://ra-agg.kipodopik.com/api/v1/alerts/real-time?token=BHHWEIP221a547&data=alert ${++counter}`
        `https://ra-agg.kipodopik.com/api/v1/alerts/real-time?token=BHHWEIP221a547&data=עתלית`
      )
        .post()
        .res()
        .catch((e) => console.error("Error", e));
    }, 2000);
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
        <Header
          alertClient={AlertClient}
          isAlertMode={this.state.isAlertMode}
          realTimeAlert={this.state.realTimeAlert}
        />
        <StickyHeader
          showStickyHeader={this.state.showStickyHeader}
          isAlertMode={this.state.isAlertMode}
          realTimeAlert={this.state.realTimeAlert}
        />

        <PreviousStats alertsClient={AlertClient} />
        {/* <Map /> */}
        {/* Are these actually "verified" or official as for rocket launch (not alerts) data? */}
        <PreviousOperations alertsClient={AlertClient} />
        <FAQ />
        <Footer />
      </div>
    );
  }
}

export default App;
