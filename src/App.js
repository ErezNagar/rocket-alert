import React from "react";
import "./App.css";
import { Row, Col } from "antd";
import Tile from "./components/Tile";
import Header from "./components/Header";
import AlertModeHeader from "./components/AlertModeHeader";
import StickyHeader from "./components/StickyHeader";
import PreviousOperations from "./components/PreviousOperations";
import Map from "./components/Map";
import Footer from "./components/Footer";
import FAQ from "./components/FAQ";
import AlertClient from "./rocket_alert_client";
import {
  getYesterday,
  getWeekBack,
  getMonthBack,
  getYearBack,
} from "./date_helper";

class App extends React.Component {
  state = {
    alerts: {},
    showStickyHeader: false,
    startfadeInEffect: false,
    randomString: "test",
    isAlertMode: true,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      startfadeInEffect: true,
    });
  }

  componentWillUnmount() {
    window.removeEventListener("scroll", this.handleScroll);
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
            randomString={this.state.randomString}
          />
        ) : (
          <Header
            getYesterday={getYesterday}
            alertClient={AlertClient}
            randomString={this.state.randomString}
          />
        )}
        {this.state.showStickyHeader && (
          <StickyHeader randomString={this.state.randomString} />
        )}

        <section className="section">
          <h2>.</h2>
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Yesterday"}
                subtitle={getYesterday()}
                fromDate={getYesterday()}
                alertsClient={AlertClient}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Past Week"}
                subtitle={`Since ${getWeekBack()}`}
                fromDate={getWeekBack()}
                alertsClient={AlertClient}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Past Month"}
                subtitle={`Since ${getMonthBack()}`}
                fromDate={getMonthBack()}
                alertsClient={AlertClient}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Past Year"}
                subtitle={`Since ${getYearBack()}`}
                fromDate={getYearBack()}
                alertsClient={AlertClient}
              />
            </Col>
          </Row>
        </section>
        {/* Are these actually "verified" or official as for rocket launch (not alerts) data? */}
        <PreviousOperations alertsClient={AlertClient} />
        <Map />
        <FAQ />
        <Footer />
      </div>
    );
  }
}

export default App;
