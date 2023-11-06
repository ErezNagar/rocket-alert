import React from "react";
import "./App.css";
import Header from "./components/Header";
import StickyHeader from "./components/StickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import PreviousStats from "./components/PreviousStats";
import MostRecentAlerts from "./components/MostRecentAlerts";
import CurrentOperation from "./components/CurrentOperation";
import RecentAlertsMap from "./components/RecentAlertsMap";
import UserLocationMap from "./components/UserLocationMap";
import LocationDistance from "./components/LocationDistance";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import AlertClient from "./rocket_alert_client";
import { Row, Col } from "antd";
import RealTimeAlertManager from "./realtime_alert_manager";
import Util from "./util";
import { getToday, getYesterday } from "./date_helper";

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
   * Gets alerts from the past 24 hours, local time.
   * If there are no alerts, returns null.
   */
  getMostRecentAlerts = () => {
    AlertClient.getMostRecentAlerts(getYesterday(), getToday()).then(
      (alerts) => {
        if (!alerts) {
          return;
        }
        this.setState({ mostRecentAlerts: alerts });
      }
    );
  };

  /*
   * Mocks alerts in the client without hitting the server
   */
  mockClientAlerts = () => {
    RealTimeAlertManager.alertQueue.push(
      JSON.stringify({
        name: "Test Sderot 1",
        englishName: null,
        lat: null,
        lon: null,
        taCityId: 123,
        countdownSec: 15,
        areaNameHe: "areaNameHe",
        areaNameEn: "areaNameEn",
        timeStamp: "2023-11-06 17:20:33",
      })
    );
    RealTimeAlertManager.alertQueue.push(
      JSON.stringify({
        name: "Test Sderot 2",
        englishName: null,
        lat: null,
        lon: null,
        taCityId: 123,
        countdownSec: 15,
        areaNameHe: "areaNameHe",
        areaNameEn: "areaNameEn",
        timeStamp: "2023-11-06 17:20:33",
      })
    );

    RealTimeAlertManager.processAlert(this.processRealTimeAlert);
  };

  /*
   * Processes a single real-time alert by showing it in the UI
   */
  processRealTimeAlert = (alert, isLastAlert) => {
    alert = JSON.parse(alert);
    const newMostRecentAlerts = [...this.state.mostRecentAlerts];
    newMostRecentAlerts.unshift(alert);
    newMostRecentAlerts.pop();

    this.setState({
      realTimeAlert: alert,
      isAlertMode: true,
      mostRecentAlerts: newMostRecentAlerts,
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
          <section className="section mostRecentAlerts">
            <Row justify="space-around" align="middle">
              <Col xs={24} lg={12}>
                <MostRecentAlerts alerts={this.state.mostRecentAlerts} />
              </Col>
              <Col xs={24} lg={12}>
                <RecentAlertsMap alerts={this.state.mostRecentAlerts} />
              </Col>
            </Row>
            <UserLocationMap alerts={this.state.mostRecentAlerts} />
            {/* <Map alerts={this.state.mostRecentAlerts} /> */}
          </section>
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
