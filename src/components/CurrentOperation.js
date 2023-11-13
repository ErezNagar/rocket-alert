import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";
import Tile from "./Tile";
import {
  getToday,
  dayOfMonthFormat,
  isWeekDifference,
  weekRangeFormat,
} from "../date_helper";
import { Column } from "@ant-design/plots";

class CurrentOperation extends React.Component {
  state = {
    data: [],
    showGraph: false,
    graphConfig: null,
  };

  componentDidMount() {
    this.getTotalAlertsByDay().then((alertsPerDay) => {
      if (!alertsPerDay || alertsPerDay.length === 0) {
        return;
      }
      this.buildGraph(alertsPerDay);
    });
  }

  getTotalAlertsByDay = () =>
    this.props.alertsClient
      .getTotalAlertsByDay(new Date("2023-10-07T00:00"), getToday())
      .then((res) => {
        return res.payload;
      })
      .catch((error) => {
        console.error(error);
        return null;
      });

  buildGraph = (alertsPerDay) => {
    let data = [];
    let weeklyAlertCount = 0;
    let weekDate = new Date(2023, 9, 7);
    alertsPerDay.forEach(({ alerts, timeStamp }) => {
      const [year, month, day] = timeStamp.split("-");
      const date = new Date(year, month - 1, day);
      if (isWeekDifference(weekDate, date)) {
        data.push({
          week: weekRangeFormat(weekDate, date),
          count: weeklyAlertCount,
        });
        weekDate = date;
        weeklyAlertCount = 0;
      }

      weeklyAlertCount += alerts;
    });

    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getToday())}`,
      count: weeklyAlertCount,
    });

    this.setState({
      showGraph: true,
      graphConfig: {
        data,
        xField: "week",
        yField: "count",
        seriesField: "",
        // columnWidthRatio: 0.5,
        columnStyle: {
          radius: [20, 20, 0, 0],
        },
        color: "#5c0011",
        appendPadding: [30, 0, 0, 0],
        label: {
          position: "top",
          style: {
            fill: "black",
            opacity: 1,
            fontSize: 16,
          },
        },
        xAxis: {
          label: {
            autoHide: true,
            autoRotate: true,
            style: {
              fill: "black",
              fontSize: 16,
            },
          },
        },
        yAxis: false,
      },
    });
  };

  render() {
    return (
      <section className="current-operation">
        <div className="currentOperationTile">
          <h2>Rocket alerts in current conflict</h2>
          <Row gutter={[24, 24]} justify={"center"}>
            <Col xs={24} sm={12} md={8} lg={6}>
              <Tile
                title={"Operation Swords of Iron"}
                subtitle={"Since October 7, 2023"}
                fromDate={new Date("2023-10-07T00:00")}
                // toDate={new Date("2022-08-08T00:00")}
                alertsClient={this.props.alertsClient}
                showAverage
              />
            </Col>
          </Row>
        </div>
        {this.state.showGraph && (
          <div className="current-operation-graph">
            <h2>Rocket alerts by week since Oct 7</h2>
            <Column {...this.state.graphConfig} />
          </div>
        )}
      </section>
    );
  }
}

CurrentOperation.propTypes = {
  alertsClient: PropTypes.object.isRequired,
};
export default CurrentOperation;
