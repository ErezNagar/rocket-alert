import React from "react";
import PropTypes from "prop-types";
import { differenceInDays } from "date-fns";
import { Row, Col, Statistic, Spin } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import FadeIn from "./FadeIn";
import { isoFormat } from "../date_helper";

const LoadingTile = ({ showAverage }) => (
  <Row
    gutter={[8]}
    justify="center"
    className={showAverage ? "loading-average" : "loading-basic"}
  >
    <Col>
      <Spin
        indicator={
          <LoadingOutlined style={{ fontSize: 24, color: "black" }} spin />
        }
      />
    </Col>
  </Row>
);

LoadingTile.propTypes = {
  showAverage: PropTypes.bool,
};
LoadingTile.defaultProps = {
  showAverage: false,
};

export default class Tile extends React.Component {
  static propTypes = {
    title: PropTypes.string,
    subtitle: PropTypes.string,
    fromDate: PropTypes.instanceOf(Date).isRequired,
    toDate: PropTypes.instanceOf(Date),
    alertsClient: PropTypes.object.isRequired,
    showAverage: PropTypes.bool,
  };

  static defaultProps = {
    title: "",
    subtitle: "",
    toDate: new Date(),
    showAverage: false,
  };

  state = { isLoading: true, isError: false, alerts: null };

  componentDidMount() {
    this.getAlerts();
  }

  getAlerts = () => {
    this.props.alertsClient
      .getTotalAlerts(
        isoFormat(this.props.fromDate),
        isoFormat(this.props.toDate)
      )
      /*
        error: null
        payload: 7325
        success: true
      */
      // .getTotalAlertsByDay(this.props.fromDate, this.props.fromDate)
      /*
      [{
        alerts: 37
        timeStamp: "2014-07-24"
      }]
      */
      .then((res) => {
        if (this.props.showAverage) {
          const duration = differenceInDays(
            new Date(this.props.toDate),
            new Date(this.props.fromDate)
          );
          this.setState({
            average: Math.round(res.payload / duration),
          });
        }
        setTimeout(() => {
          this.setState({ alerts: res.payload, isLoading: false });
        }, Math.floor(Math.random() * 4) * 1000);
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isError: true });
      });
  };

  render() {
    const hasData = !this.state.isLoading && !this.state.isError;

    return (
      <div className="tile">
        <h3>{this.props.title}</h3>
        <div className="subtitle">{this.props.subtitle}</div>
        <div>
          {this.state.isLoading && <LoadingTile {...this.props} />}
          {hasData && this.props.showAverage && (
            <Row gutter={[8]} justify="center" className="average-container">
              <Col>
                <div className="alerts">
                  <FadeIn show={!this.state.isLoading} fadeInOnly>
                    <Statistic value={this.state.alerts} />
                  </FadeIn>
                </div>
                <div>Total</div>
              </Col>
              <Col className="separator">.</Col>
              <Col>
                <div className="average">
                  <FadeIn show={!this.state.isLoading} fadeInOnly>
                    <Statistic value={this.state.average} />
                  </FadeIn>
                </div>
                <div>Avg/Day</div>
              </Col>
            </Row>
          )}
          {hasData && !this.props.showAverage && (
            <div className="alerts">
              <FadeIn show={!this.state.isLoading} fadeInOnly>
                <Statistic value={this.state.alerts} />
              </FadeIn>
            </div>
          )}
          {this.state.isError && (
            <FadeIn show={!this.state.isLoading} fadeInOnly>
              <ExclamationCircleOutlined
                className={
                  this.props.showAverage ? "loading-average" : "loading-basic"
                }
              />
              {" Error"}
            </FadeIn>
          )}
        </div>
      </div>
    );
  }
}
