import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Button } from "antd";
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
    showGraphByWeek: false,
    showGraphByDay: false,
    graphConfig: null,
    selectedMonth: null,
    graph2Config: null,
  };

  componentDidMount() {
    this.getTotalAlertsByDay().then((alertsPerDay) => {
      if (!alertsPerDay || alertsPerDay.length === 0) {
        return;
      }
      this.buildAlertsByWeekGraph(alertsPerDay);
      this.buildAlertsByDayGraph(alertsPerDay);
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

  buildAlertsByWeekGraph = (alertsPerDay) => {
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
      showGraphByWeek: true,
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

  buildAlertsByDayGraph = (alertsPerDay) => {
    const data = { months: [] };
    alertsPerDay.forEach(({ alerts, timeStamp }) => {
      const [year, month, day] = timeStamp.split("-");
      const date = new Date(year, month - 1, day);
      // const monthName = date.toLocaleString("default", { month: "short" });
      const monthName = date.toLocaleString("default", { month: "long" });
      if (!data.months.includes(monthName)) {
        data.months.push(monthName);
        data[monthName] = [];
      }
      data[monthName].push({ day: dayOfMonthFormat(date), count: alerts });
    });

    const selectedMonth = data.months[data.months.length - 1];
    this.setState({
      showGraphByDay: true,
      byDayData: data,
      selectedMonth,
      graph2Config: {
        data: data[selectedMonth],
        xField: "day",
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
          autoHide: true,
          autoRotate: true,
          autoEllipsis: true,
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
              intervalPadding: 10,
            },
          },
        },
        yAxis: false,
      },
    });
  };

  handleMonthClick = (month) => {
    this.setState({
      selectedMonth: month,
      graph2Config: {
        ...this.state.graph2Config,
        data: this.state.byDayData[month],
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
        {(this.state.showGraphByWeek || this.state.showGraphByDay) && (
          <div className="current-operation-graph">
            <Row gutter={[24, 24]} justify={"center"}>
              {this.state.showGraphByWeek && (
                <Col span={24}>
                  <h2>Alerts by week since Oct 7</h2>
                  <Column {...this.state.graphConfig} />
                </Col>
              )}
              {this.state.showGraphByDay && (
                <Col span={24}>
                  <h2>Alerts by day since Oct 7</h2>
                  <Row justify={"center"} className={"month-list"}>
                    {this.state.byDayData.months.map((month) => (
                      <Col xs={24} md={3} lg={2} key={month}>
                        <Button
                          size="large"
                          type="text"
                          className={
                            this.state.selectedMonth === month
                              ? "month-button selected"
                              : "month-button"
                          }
                          onClick={() => this.handleMonthClick(month)}
                        >
                          {month}
                        </Button>
                      </Col>
                    ))}
                  </Row>
                  <Column {...this.state.graph2Config} />
                </Col>
              )}
            </Row>
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
