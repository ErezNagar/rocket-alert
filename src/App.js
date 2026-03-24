import React from "react";
import "./App.css";
import HeaderContainer from "./components/Header/HeaderContainer";
import StickyHeader from "./components/Header/StickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import MostRecentAlerts from "./components/MostRecentAlerts";
import OperationSwordsOfIron from "./components/OperationSwordsOfIron";
import OperationLionsRoar from "./components/OperationLionsRoar";
import RecentAlertsMap from "./components/RecentAlertsMap";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
// import Social from "./components/Social";
import AlertClient from "./rocket_alert_client";
import { Row, Col } from "antd";
import RealTimeAlertManager from "./realtime_alert_manager";
import Utilities from "./utilities/utilities";
import Tracking from "./tracking";
import { getNow, get24HoursAgo, get48HoursAgo } from "./utilities/date_helper";
import TimeToShelter from "./components/TimeToShelter";
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
    // Alerts from 24 and up to 48 hours ago
    alerts48HrsAgo: [],
    // Most recent alerts (since the last history sync)
    mostRecentAlerts: [],
    // Real-time alerts that have been triggred since the last history sync
    realTimeAlertCache: { alerts: [], count: null },
    // Text when sharing on twitter. Generated in Header
    twitterShareText: "",
    // The location to focus on on the map
    mapFocus: null,
    // Whether to show reset map focus. Used when map is focused to a location
    showResetFocus: false,
  };

  alertEventSource = null;

  componentDidMount() {
    RealTimeAlertManager.startRealTimeAlerts(
      AlertClient,
      this.processRealTimeAlert,
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
    const dateTime24HrsAgo = get24HoursAgo();
    Promise.all([
      AlertClient.getMostRecentAlerts(get48HoursAgo(), dateTime24HrsAgo),
      AlertClient.getMostRecentAlerts(dateTime24HrsAgo, getNow()),
      AlertClient.getRealTimeAlertCache(),
    ])
      .then((values) => {
        const alerts48HrsAgo = values[0] ? values[0] : [];
        const mostRecentAlerts = values[1] ? values[1] : [];
        const realTimeAlertCache = values[2] ? values[2] : [];

        if (
          !alerts48HrsAgo &&
          !mostRecentAlerts &&
          realTimeAlertCache.count === 0
        ) {
          return;
        }

        this.setState({
          alerts48HrsAgo: alerts48HrsAgo.reverse(),
          mostRecentAlerts: [...mostRecentAlerts, ...realTimeAlertCache.alerts]
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
          name: "פדיה",
          englishName: "Pdaya",
          lat: 31.8578,
          lon: 34.8838,
          taCityId: 561,
          alertTypeId: 1,
          countdownSec: 90,
          areaNameHe: "השפלה",
          areaNameEn: "Shfela (Lowlands)",
          timeStamp: "2026-02-28 11:15:29",
        },
        {
          name: "צלפון",
          englishName: "Tzalfon",
          lat: 31.8056,
          lon: 34.9318,
          taCityId: 487,
          alertTypeId: 1,
          countdownSec: 90,
          areaNameHe: "שפלת יהודה",
          areaNameEn: "Shfelat Yehuda",
          timeStamp: "2026-02-28 11:15:29",
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
    alert.forEach((a) => newMostRecentAlerts.unshift(a));

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

  handleToggleMapFocus = (alert) =>
    this.setState({ mapFocus: alert, showResetFocus: alert !== "reset" });

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
        {(this.state.alerts48HrsAgo.length > 0 ||
          this.state.mostRecentAlerts.length > 0) && (
          <section className="section mostRecentAlerts">
            <Row justify="space-around" align="middle">
              {process.env.REACT_APP_SHOULD_SHOW_MAP === "true" ? (
                <>
                  <Col xs={24} lg={12}>
                    <MostRecentAlerts
                      alerts={[
                        ...this.state.mostRecentAlerts,
                        ...this.state.alerts48HrsAgo,
                      ]}
                      showResetFocus={this.state.showResetFocus}
                      onToggleMapFocus={this.handleToggleMapFocus}
                    />
                  </Col>
                  <Col xs={24} lg={12}>
                    <RecentAlertsMap
                      alerts48HrsAgo={this.state.alerts48HrsAgo}
                      mostRecentAlerts={this.state.mostRecentAlerts}
                      mapFocus={this.state.mapFocus}
                    />
                  </Col>
                </>
              ) : (
                <>
                  <Col xs={24}>
                    <MostRecentAlerts
                      alerts={[
                        ...this.state.mostRecentAlerts,
                        ...this.state.alerts48HrsAgo,
                      ]}
                      showResetFocus={this.state.showResetFocus}
                      onToggleMapFocus={this.handleToggleMapFocus}
                    />
                  </Col>
                </>
              )}
            </Row>
            <TimeToShelter
              alerts={this.state.mostRecentAlerts}
              onToggleMapFocus={this.handleToggleMapFocus}
            />
          </section>
        )}
        <OperationLionsRoar alertsClient={AlertClient} />
        <OperationSwordsOfIron alertsClient={AlertClient} />
        {/* <Social /> */}
        {/* <LocationDistance /> */}
        <PreviousOperations alertsClient={AlertClient} />
        <FAQ />
        <SupportUs />
        <Footer twitterShareText={this.state.twitterShareText} />
      </div>
    );
  }
}

export default App;
