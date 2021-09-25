import React from "react";
import "./App.css";
import Tile from "./components/Tile";
import AlertClient from "./rocket_alert_client";
import {
  getYesterday,
  getWeekBack,
  getMonthBack,
  getYearBack,
} from "./date_helper";
import { Row, Col, Statistic } from "antd";
import { TwitterOutlined } from "@ant-design/icons";

class App extends React.Component {
  state = {
    alerts: {},
    showStickyHeader: false,
    showApp: false,
  };

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    this.setState({
      showApp: true,
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
          this.state.showApp ? "pageContainer active" : "pageContainer"
        }
      >
        <header
          className={
            this.state.showStickyHeader
              ? "sticky-header active"
              : "sticky-header"
          }
        >
          <div className="left-container">
            <div className="title">Ra</div>
            <div className="alerts">
              <Statistic value={7325} />
            </div>
          </div>
          <div className="right-container">
            <TwitterOutlined style={{ fontSize: "24px", color: "white" }} />
            #RocketAlerts
          </div>
        </header>
        <header className="header">
          <div className="top">
            <h1>Rocket alerts</h1>
            <h2>Real time rocket alerts in Israel</h2>
          </div>
          <Tile
            isHeroTile
            title={"alerts today"}
            subtitle={getYesterday()}
            fromDate={getYesterday()}
            alertsClient={AlertClient}
          />
          <div className="share">
            <a
              href="https://twitter.com/intent/tweet?button_hashtag=RocketAlert&ref_src=twsrc%5Etfw"
              data-show-count="false"
              data-text="custom share text"
              data-url="https://dev.twitter.com/web/tweet-button"
              data-hashtags="example,demo"
              data-via="twitterdev"
              data-related="twitterapi,twitter"
            >
              <div>
                <TwitterOutlined style={{ fontSize: "24px", color: "white" }} />
              </div>
              <div>#RocketAlerts</div>
            </a>
          </div>
        </header>
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
        <section className="section">
          <h2>Previous operations</h2>
          {/* Are these actually "verified" or official as for rocket launch (not alerts) data? */}
          <Row gutter={[24, 24]}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Operation Cast Lead"}
                subtitle={"27 Dec 2008 - 18 Jan 2009"}
                fromDate={"2008-12-27"}
                toDate={"2009-01-18"}
                alertsClient={AlertClient}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Operation Pillar of Defense"}
                subtitle={"14 Nov 2012 - 21 Nov 2012"}
                fromDate={"2012-11-14"}
                toDate={"2012-11-21"}
                alertsClient={AlertClient}
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Operation Protective Edge"}
                subtitle={"8 July 2014 - 26 Aug 2014"}
                fromDate={"2014-07-08"}
                toDate={"2014-08-26"}
                alertsClient={AlertClient}
                showAverage
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Operation Black Belt"}
                subtitle={"12 Nov 2019 - 16 Nov 2019"}
                fromDate={"2019-11-12"}
                toDate={"2019-11-16"}
                alertsClient={AlertClient}
                showAverage
              />
            </Col>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Operation Guardian of the Walls"}
                subtitle={"10 May 2021 - 21 May 2021"}
                fromDate={"2021-05-10"}
                toDate={"2021-05-21"}
                alertsClient={AlertClient}
                showAverage
              />
            </Col>
          </Row>
        </section>
        <section className="section">
          <h2>Map</h2>
        </section>
        <section className="section faq">
          <h2>Frequently Asked Questions</h2>
        </section>
        <footer></footer>
      </div>
    );
  }
}

export default App;
