import React from "react";
import "./App.css";
import HeaderContainer from "./components/Header/HeaderContainer";
import StickyHeader from "./components/Header/StickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import MostRecentAlerts from "./components/MostRecentAlerts";
import CurrentOperation from "./components/CurrentOperation";
import RecentAlertsMap from "./components/RecentAlertsMap";
import LocationDistance from "./components/LocationDistance";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import Social from "./components/Social";
import AlertClient from "./rocket_alert_client";
import { Row, Col } from "antd";
import RealTimeAlertManager from "./realtime_alert_manager";
import Utilities from "./utilities/utilities";
import Tracking from "./tracking";
import { getNow, get24HoursAgo } from "./utilities/date_helper";
// import TimeToShelter from "./components/TimeToShelter";
import SupportUs from "./components/SupportUs";

class App extends React.Component {
  state = {
    alerts: {},
    showStickyHeader: false,
    // Whether query string alert mode param is set
    isAlertModeOverride: false,
    // Whether the app currently receives incoming alerts
    isAlertMode: false,
    // Whether this is the last real-time alert of the alert batch
    isLastAlertOfBatch: false,
    // The alert object
    realTimeAlert: null,
    // Most recent alerts (since the last history sync)
    mostRecentAlerts: [],
    // Real-time alerts that have been triggred since the last history sync
    realTimeAlertCache: { alerts: [], count: null },
    // Text when sharing on twitter. Generated in Header
    twitterShareText: "",
    // The location to focus on on the map
    mapFocus: null,
  };

  alertEventSource = null;

  componentDidMount() {
    RealTimeAlertManager.startRealTimeAlerts(
      AlertClient,
      this.processRealTimeAlert
    );

    if (Utilities.isDev() && Utilities.isAlertModeQueryString()) {
      this.mockClientAlerts();
    }

    this.getMostRecentAlerts();

    window.addEventListener("scroll", this.handleScroll);
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
    Promise.all([
      AlertClient.getMostRecentAlerts(get24HoursAgo(), getNow()),
      AlertClient.getRealTimeAlertCache(),
    ])
      .then((values) => {
        const mostRecentAlerts = values[0] ? values[0] : [];
        const realTimeAlertCache = values[1] ? values[1] : [];

        if (!mostRecentAlerts && realTimeAlertCache.count === 0) {
          return;
        }

        this.setState({
          mostRecentAlerts: mostRecentAlerts
            .concat(realTimeAlertCache.alerts)
            .slice(-Utilities.MAX_RECENT_ALERTS)
            .reverse(),
          realTimeAlertCache,
        });
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isError: true });
      });
  };

  /*
   * Mocks alerts in the client without hitting the server
   */
  mockClientAlerts = () => {
    const alerts = {
      alerts: [
        {
          name: "Test Eilat 1",
          englishName: null,
          lat: 29.6276236,
          lon: 34.7892581,
          taCityId: 4,
          countdownSec: 15,
          areaNameHe: "areaNameHe",
          areaNameEn: "areaNameEn",
          timeStamp: "2023-11-06 17:20:33",
          alertTypeId: Utilities.ALERT_TYPE_ROCKETS,
        },
        {
          name: "Test Eilat 2",
          englishName: null,
          lat: 29.6276236,
          lon: 34.7892581,
          taCityId: 4,
          countdownSec: 15,
          areaNameHe: "areaNameHe",
          areaNameEn: "areaNameEn",
          timeStamp: "2023-11-06 17:20:33",
          alertTypeId: Utilities.ALERT_TYPE_UAV,
        },
      ],
    };

    alerts.alerts.forEach((alert) => {
      RealTimeAlertManager.alertQueue.push(alert);
    });

    RealTimeAlertManager.processAlert(this.processRealTimeAlert);
  };

  /*
   * Processes a single real-time alert by showing it in the UI
   */
  processRealTimeAlert = (alert, isLastAlert) => {
    const newMostRecentAlerts = [...this.state.mostRecentAlerts];
    // Add alert to top of alert list
    if (Array.isArray(alert)) {
      alert.forEach((a) => newMostRecentAlerts.unshift(a));
    } else {
      newMostRecentAlerts.unshift(alert);
    }
    // Maintain a max of Utilities.MAX_RECENT_ALERTS most recent alerts by removing the oldest
    if (newMostRecentAlerts.length >= Utilities.MAX_RECENT_ALERTS) {
      newMostRecentAlerts.pop();
    }

    this.setState({
      realTimeAlert: alert,
      isAlertMode: true,
      mostRecentAlerts: newMostRecentAlerts,
      isLastAlertOfBatch: isLastAlert,
    });
    if (isLastAlert) {
      setTimeout(() => {
        this.setState({
          isAlertMode: false,
        });
      }, Utilities.REAL_TIME_ALERT_THROTTLE_DURATION);
    }

    Tracking.alertModeOnEvent();
  };

  handleScroll = (e) => {
    const vh80 = window.innerHeight * 0.9;
    this.setState({
      showStickyHeader: window.scrollY > Math.floor(vh80) ? true : false,
    });
  };

  handleOnTwitterShareText = (twitterShareText) => {
    this.setState({ twitterShareText });
  };

  handleOnAlertLocationClick = (alert) => this.setState({ mapFocus: alert });

  render() {
    return (
      <div className={"pageContainer"}>
        <HeaderContainer
          alertClient={AlertClient}
          isAlertMode={this.state.isAlertMode}
          realTimeAlert={this.state.realTimeAlert}
          realTimeAlertCache={this.state.realTimeAlertCache}
          isLastAlertOfBatch={this.state.isLastAlertOfBatch}
          onTwitterShareText={this.handleOnTwitterShareText}
        />
        <StickyHeader
          showStickyHeader={this.state.showStickyHeader}
          isAlertMode={this.state.isAlertMode}
          realTimeAlert={this.state.realTimeAlert}
          twitterShareText={this.state.twitterShareText}
        />
        <SupportUs />
        {this.state.mostRecentAlerts.length > 0 && (
          <section className="section mostRecentAlerts">
            <Row justify="space-around" align="middle">
              {process.env.REACT_APP_SHOULD_SHOW_MAP === "true" ? (
                <>
                  <Col xs={24} lg={12}>
                    <MostRecentAlerts
                      alerts={this.state.mostRecentAlerts}
                      onAlertLocationClick={this.handleOnAlertLocationClick}
                    />
                  </Col>
                  <Col xs={24} lg={12}>
                    <RecentAlertsMap
                      alerts={this.state.mostRecentAlerts}
                      mapFocus={this.state.mapFocus}
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={24}>
                    <MostRecentAlerts
                      alerts={this.state.mostRecentAlerts}
                      onAlertLocationClick={this.handleOnAlertLocationClick}
                    />
                  </Col>
                </>
              )}
            </Row>
            {/* <TimeToShelter alerts={this.state.mostRecentAlerts} /> */}
          </section>
        )}
        <CurrentOperation alertsClient={AlertClient} />
        <Social />
        <LocationDistance />
        <PreviousOperations alertsClient={AlertClient} />
        <FAQ />
        <SupportUs />
        <Footer twitterShareText={this.state.twitterShareText} />
      </div>
    );
  }
}

export default App;
