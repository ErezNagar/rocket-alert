import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";
import Tile from "./Tile";
import { getNow } from "../date_helper";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";
import PreviousStats from "./PreviousStats";
import GraphTotalAlerts from "./GraphTotalAlerts";
import GraphAlertsByDay from "./GraphAlertsByDay";
import GraphAlertsBySource from "./GraphAlertsBySource";

class CurrentOperation extends React.Component {
  state = {
    mostTargetedLocations: null,
    mostTargetedRegions: null,
    detaildAlerts: null,
  };

  componentDidMount() {
    this.getDetailedAlerts().then((alerts) => {
      if (!alerts || alerts.length === 0) {
        return;
      }
      this.setState({ detaildAlerts: alerts });
    });

    this.getMostTargetedLocations().then((res) => {
      if (!res) {
        return;
      }
      this.setState({ mostTargetedLocations: res });
    });

    this.getMostTargetedRegions().then((res) => {
      if (!res) {
        return;
      }
      this.setState({ mostTargetedRegions: res });
    });
  }

  getDetailedAlerts = () =>
    this.props.alertsClient
      .getDetailedAlerts(new Date("2023-10-07"), getNow())
      .then((res) => {
        return res.payload;
      })
      .catch((error) => {
        Tracking.detailedAlertsByDayError(error);
        console.error(error);
        return null;
      });

  getMostTargetedLocations = () =>
    this.props.alertsClient
      .getMostTargetedLocations(new Date("2023-10-07"), getNow())
      .then((res) => {
        return res.payload;
      })
      .catch((error) => {
        Tracking.mostTargetedLocationsError(error);
        return null;
      });

  getMostTargetedRegions = () =>
    this.props.alertsClient
      .getMostTargetedRegions(new Date("2023-10-07"), getNow())
      .then((res) => {
        return res.payload;
      })
      .catch((error) => {
        Tracking.mostTargetedRegionError(error);
        return null;
      });

  render() {
    return (
      <section ref={this.props.isIntersectingRef} className="current-operation">
        <div className="currentOperationTile">
          <h2>Rocket alerts in current conflict</h2>
          <Row gutter={[24, 24]} justify={"center"}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Operation Swords of Iron"}
                subtitle={"Since October 7, 2023"}
                fromDate={new Date("2023-10-07")}
                // toDate={new Date("2022-08-08T00:00")}
                alertsClient={this.props.alertsClient}
                showAverage
              />
            </Col>
          </Row>
        </div>

        <PreviousStats alertsClient={this.props.alertsClient} />
        <GraphTotalAlerts alertData={this.state.detaildAlerts} />
        <GraphAlertsBySource alertData={this.state.detaildAlerts} />
        <GraphAlertsByDay alertData={this.state.detaildAlerts} />
        <Row justify={"center"}>
          {this.state.mostTargetedLocations &&
            this.state.mostTargetedRegions && (
              <>
                <Col xs={24} lg={12} className="community">
                  <h2>Most targeted communities</h2>
                  {this.state.mostTargetedLocations.map((location) => (
                    <Row justify={"center"} key={location.englishName}>
                      <Col span={18}>
                        <a
                          className="most-targeted-location"
                          href={`https://www.google.com/maps/?q=${location.lat},${location.lon}`}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {location.englishName || location.name}
                        </a>
                      </Col>
                      <Col span={3} className="most-targeted-region">
                        {location.total}
                      </Col>
                    </Row>
                  ))}
                </Col>
                <Col xs={24} lg={12} className="community">
                  <h2>Most targeted regions</h2>
                  {this.state.mostTargetedRegions.map((region) => (
                    <Row
                      key={region.areaNameEn}
                      justify={"center"}
                      className="most-targeted-region"
                    >
                      <Col span={18}>
                        {region.areaNameEn || region.areaNameHe}
                      </Col>
                      <Col span={3}>{region.total}</Col>
                    </Row>
                  ))}
                </Col>
              </>
            )}
        </Row>
      </section>
    );
  }
}

CurrentOperation.propTypes = {
  alertsClient: PropTypes.object.isRequired,
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(CurrentOperation, "CurrentOperation");
