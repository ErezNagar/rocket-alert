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
import queryString from "query-string";
import { getYesterday } from "./date_helper";

class App extends React.Component {
  state = {
    alerts: {},
    showStickyHeader: false,
    startfadeInEffect: false,
    randomString: "test",
    isAlertMode: false,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    const isAlertMode = this.getAppMode();
    this.setState({
      startfadeInEffect: true,
      isAlertMode,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
  }

  getAppMode = () => {
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
            randomString={this.state.randomString}
          />
        ) : (
          <Header getYesterday={getYesterday} alertClient={AlertClient} />
        )}
        {this.state.showStickyHeader && this.state.isAlertMode && (
          <AlertModeStickyHeader />
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
