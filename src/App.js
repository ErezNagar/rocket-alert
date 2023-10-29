import React from "react";
import "./App.css";
import Header from "./components/Header";
import StickyHeader from "./components/StickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import PreviousStats from "./components/PreviousStats";
import MostRecentAlerts from "./components/MostRecentAlerts";
import CurrentOperation from "./components/CurrentOperation";
import Map from "./components/Map";
import LocationDistance from "./components/LocationDistance";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import AlertClient from "./rocket_alert_client";
import RealTimeAlertManager from "./realtime_alert_manager";
import Util from "./util";
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
    mostRecentAlerts: [],
    // Text when sharing on twitter. Generated in Header
    twitterShareText: "",
  };

  alertEventSource = null;

  componentDidMount() {
    RealTimeAlertManager.startRealTimeAlerts(
      AlertClient,
      this.processRealTimeAlert
    );
    if (Util.isDev() && Util.isAlertModeQueryString()) {
      this.mockClientAlerts();
    }

    this.getMostRecentAlerts();

    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      startfadeInEffect: true,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
    RealTimeAlertManager.stopRealTimeAlerts();
  }

  /*
   * Gets the alerts from the past 24 hours.
   * If there are no alerts in the past 24 hours, returns null.
   * Calculates the server time to get query for the latest data, in case the client is behind
   */
  getMostRecentAlerts = () => {
    const israelTimeZone = formatInTimeZone(
      new Date(),
      "Asia/Jerusalem",
      "yyyy-MM-dd HH:mm"
    );
    const israelTimeZoneUTC = zonedTimeToUtc(
      israelTimeZone,
      Intl.DateTimeFormat().resolvedOptions().timeZone
    );
    const yesterdayIsraelTimeZone = subDays(israelTimeZoneUTC, 1);
    const yesterdayFormatted = format(yesterdayIsraelTimeZone, "yyyy-MM-dd");
    const todayFormatted = format(israelTimeZoneUTC, "yyyy-MM-dd");

    AlertClient.getMostRecentAlerts(yesterdayFormatted, todayFormatted).then(
      (alerts) => {
        if (!alerts) {
          return;
        }
        this.setState({ mostRecentAlerts: alerts.reverse() });
      }
    );
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
        timeStamp: "2022-08-05 23:19:05",
      })
    );
    RealTimeAlertManager.alertQueue.push(
      JSON.stringify({
        name: "Sderot 2",
        englishName: null,
        lat: null,
        lon: null,
        timeStamp: "2022-08-05 23:19:05",
      })
    );

    RealTimeAlertManager.processAlert(this.processRealTimeAlert);
  };

  /*
   * Processes a single real-time alert by showing it in the UI
   */
  processRealTimeAlert = (alert, isLastAlert) => {
    this.setState({
      realTimeAlert: JSON.parse(alert),
      isAlertMode: true,
    });
    if (isLastAlert) {
      setTimeout(() => {
        this.setState({
          isAlertMode: false,
        });
      }, Util.REAL_TIME_ALERT_THROTTLE_DURATION);
    }
  };

  handleScroll = (e) => {
    const vh80 = window.innerHeight * 0.8;
    this.setState({
      showStickyHeader: window.scrollY > Math.floor(vh80) ? true : false,
    });
  };

  handleOnTwitterShareText = (twitterShareText) => {
    this.setState({ twitterShareText });
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
          onTwitterShareText={this.handleOnTwitterShareText}
        />
        <StickyHeader
          showStickyHeader={this.state.showStickyHeader}
          isAlertMode={this.state.isAlertMode}
          realTimeAlert={this.state.realTimeAlert}
          twitterShareText={this.state.twitterShareText}
        />

        {this.state.mostRecentAlerts.length > 0 && (
          <>
            <MostRecentAlerts alerts={this.state.mostRecentAlerts} />
            <Map alerts={this.state.mostRecentAlerts} />
          </>
        )}
        <LocationDistance />
        <CurrentOperation alertsClient={AlertClient} />
        <PreviousStats alertsClient={AlertClient} />
        {/* Are these actually "verified" or official as for rocket launch (not alerts) data? */}
        <PreviousOperations alertsClient={AlertClient} />
        <FAQ />
        <Footer twitterShareText={this.state.twitterShareText} />
      </div>
    );
  }
}

export default App;
