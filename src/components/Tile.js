import React from "react";
import PropTypes from "prop-types";
import { differenceInDays } from "date-fns";
import { Row, Col, Statistic, Spin } from "antd";
import { LoadingOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import FadeIn from "./FadeIn";
import Tracking from "../tracking";
import Util from "../util";
import Sparkline from "./Sparkline";

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
    fromDate: PropTypes.instanceOf(Date),
    toDate: PropTypes.instanceOf(Date),
    alertsClient: PropTypes.object,
    sparklineData: PropTypes.array,
    showAverage: PropTypes.bool,
    // "Static" tile uses alertCount instead of making a request to the server
    isStatic: PropTypes.bool,
    alertCount: PropTypes.number,
    alertTypeId: PropTypes.number,
  };

  static defaultProps = {
    title: "",
    subtitle: "",
    toDate: new Date(),
    alertsClient: {},
    showAverage: false,
    isStatic: false,
    alertCount: 0,
    alertTypeId: Util.ALERT_TYPE_ROCKETS,
  };

  state = {
    isLoading: true,
    isSparklineLoading: false,
    sparklineRocketData: [],
    sparklineUAVData: [],
    isError: false,
    alerts: null,
    average: 0,
  };

  componentDidMount() {
    if (this.props.isStatic) {
      this.setState({
        alerts: this.props.alertCount,
        isLoading: false,
        average: this.props.showAverage
          ? this.getAverage(this.props.alertCount)
          : 0,
      });
    } else {
      this.getAlerts();
      this.getDailyAlerts();
    }
  }

  getAlerts = () => {
    this.props.alertsClient
      .getTotalAlerts(
        this.props.fromDate,
        this.props.toDate,
        this.props.alertTypeId
      )
      .then((res) => {
        if (this.props.showAverage) {
          this.setState({
            average: this.getAverage(res.payload),
          });
        }
        this.setState({ alerts: res.payload, isLoading: false });
      })
      .catch((error) => {
        Tracking.tileError(error);
        console.error(error);
        this.setState({ isError: true, isLoading: false });
      });
  };

  getDailyAlerts = () => {
    this.setState({ isSparklineLoading: true });
    this.props.alertsClient
      .getTotalAlertsByDay(
        this.props.fromDate,
        this.props.toDate,
        this.props.alertTypeId
      )
      .then((res) => {
        const data = res.payload.map((date) => date.alerts);
        if (this.props.alertTypeId === Util.ALERT_TYPE_ROCKETS) {
          const sparklineData = [];
          let count = 0;
          for (let i = 0; i < data.length; i++) {
            if ((i + 1) % 9 === 0) {
              sparklineData.push(count);
              count = 0;
            }
            count += data[i];
          }
          sparklineData.push(count);
          this.setState({
            sparklineData,
            isSparklineLoading: false,
          });
        }
        if (this.props.alertTypeId === Util.ALERT_TYPE_UAV) {
          const sparklineData = data
            .filter((_, idx) => (idx + 1) % 2 !== 0)
            .filter((_, idx) => (idx + 1) % 2 !== 0)
            .filter((_, idx) => (idx + 1) % 2 !== 0);
          this.setState({
            sparklineData,
            isSparklineLoading: false,
          });
        }
      })
      .catch((error) => {
        Tracking.tileError(error);
        console.error(error);
        this.setState({ isError: true, isSparklineLoading: false });
      });
  };

  getAverage = (total) => {
    const dayCount = differenceInDays(
      new Date(this.props.toDate),
      new Date(this.props.fromDate)
    );
    return Math.round(total / dayCount);
  };

  getNameId = () => this.props.title.replaceAll(" ", "_").toLowerCase();

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
                  <FadeIn show={!this.state.isLoading}>
                    <Statistic value={this.state.alerts} />
                  </FadeIn>
                </div>
                <div>Total</div>
              </Col>
              <Col className="separator">.</Col>
              <Col>
                <div className="average">
                  <FadeIn show={!this.state.isLoading}>
                    <Statistic value={this.state.average} />
                  </FadeIn>
                </div>
                <div>Avg/Day</div>
              </Col>
            </Row>
          )}
          {hasData && !this.props.showAverage && (
            <div className="alerts">
              <FadeIn show={!this.state.isLoading}>
                <Statistic value={this.state.alerts} />
              </FadeIn>
            </div>
          )}
          {this.state.isError && (
            <FadeIn show={!this.state.isLoading}>
              <ExclamationCircleOutlined
                className={
                  this.props.showAverage ? "loading-average" : "loading-basic"
                }
              />
              {" Data unavailable"}
            </FadeIn>
          )}
          {(this.props.sparklineData || this.state.sparklineData) && (
            <Sparkline
              id={this.props.title}
              width={250}
              height={50}
              data={this.props.sparklineData || this.state.sparklineData}
            />
          )}
        </div>
      </div>
    );
  }
}
