import React from "react";
import "./App.css";
import Header from "./components/Header";
import StickyHeader from "./components/StickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import PreviousStats from "./components/PreviousStats";
import RecentAlerts from "./components/RecentAlerts";
import CurrentOperation from "./components/CurrentOperation";
// import Map from "./components/Map";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import AlertClient from "./rocket_alert_client";
import RealTimeAlertManager from "./realtime_alert_manager";
import Util from "./util";
import queryString from "query-string";
import wretch from "wretch";
import { subDays, format } from "date-fns";
import { zonedTimeToUtc, formatInTimeZone } from "date-fns-tz";

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
    // Most recent alerts
    // TODO: to show when there's currently an operation
    recentAlerts: [],
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
    RealTimeAlertManager.startRealTimeAlerts(AlertClient, this.processAlert);
    if (Util.isDev() && this.isAlertModeQueryString()) {
      // this.mockIncomeServerAlerts();
      this.mockClientAlerts();
    }

    this.getRecentAlerts();

    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      startfadeInEffect: true,
    });
  }

  /*
   * Processes a single alert by showing it in the UI
   */
  processAlert = (alert, isLastAlert) => {
    if (Util.isDev()) {
      console.log("Processing alert", alert);
    }
    this.setState({
      realTimeAlert: JSON.parse(alert),
      isAlertMode: true,
    });
    if (isLastAlert) {
      setTimeout(() => {
        this.setState({
          isAlertMode: false,
        });
      }, 5000);
    }
  };

  /*
   * Gets the most recent alerts from the past 24 hours.
   * If no alerts in the past 24 hours, returns null.
   * Calculates the server time to get query for the latest data, in case the client is behind
   */
  getRecentAlerts = () => {
    const israelDateTime = formatInTimeZone(
      new Date(),
      "Asia/Jerusalem",
      "yyyy-MM-dd HH:mm"
    );
    const israelDateTimeUTC = zonedTimeToUtc(
      israelDateTime,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const serverToday = format(israelDateTimeUTC, "yyyy-MM-dd");
    const serverYesterday = format(subDays(israelDateTimeUTC, 1), "yyyy-MM-dd");

    AlertClient.getRecentAlerts(serverYesterday, serverToday).then(
      (recentAlerts) => {
        if (!recentAlerts) {
          return;
        }
        this.setState({ recentAlerts: recentAlerts.reverse() });
      }
    );
  };

  /*
   * Mocks incoming alerts by hitting the server.
   * Waits 2 seconds before initiating requests. After which, call the server in intervals
   */
  mockIncomeServerAlerts = () => {
    setInterval(() => {
      wretch(
        `https://ra-agg.kipodopik.com/api/v1/alerts/real-time?token=BHHWEIP221a547&data=Sderot`
      )
        .post()
        .res()
        .catch((e) => console.error("Error", e));
    }, 2000);
  };

  /*
   * Mocks alerts in the client without hitting the server
   */
  mockClientAlerts = () => {
    RealTimeAlertManager.alertQueue.push(
      JSON.stringify({
        name: "Sderot 1",
        englishName: null,
        lat: null,
        lon: null,
        timeStamp: "2022-08-05 23:18:05",
      })
    );
    RealTimeAlertManager.processAlert(this.processAlert);
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

        {this.state.recentAlerts.length > 0 && (
          <RecentAlerts
            alertsClient={AlertClient}
            recentAlerts={this.state.recentAlerts}
          />
        )}
        <CurrentOperation alertsClient={AlertClient} />
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
