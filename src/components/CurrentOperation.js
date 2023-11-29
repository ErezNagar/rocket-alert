import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Button } from "antd";
import Tile from "./Tile";
import { eachDayOfInterval, isSameDay } from "date-fns";
import {
  getToday,
  dayOfMonthFormat,
  isWeekDifference,
  weekRangeFormat,
} from "../date_helper";
import { Column, Bar } from "@ant-design/plots";

class CurrentOperation extends React.Component {
  state = {
    data: [],
    showGraphByWeek: false,
    showGraphByDay: false,
    graphByDayType: "Column",
    graphByWeekConfig: null,
    selectedMonth: null,
    graphByDayConfig: null,
  };

  componentDidMount() {
    this.getTotalAlertsByDay().then((alertsPerDay) => {
      if (!alertsPerDay || alertsPerDay.length === 0) {
        return;
      }
      this.buildAlertsByWeekGraph(alertsPerDay);
      this.buildAlertsByDayGraph(alertsPerDay);
    });

    window.addEventListener("resize", this.updateGraphType);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateGraphType);
  }

  updateGraphType = () => {
    const columnConfig = {
      xField: "day",
      yField: "count",
      seriesField: "",
      columnStyle: {
        radius: [20, 20, 0, 0],
      },
      maxColumnWidth: 40,
      color: "#5c0011",
      appendPadding: [50, 0, 10, 10],
      autoFit: true,
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
          },
        },
      },
      yAxis: false,
    };
    const barConfig = {
      xField: "count",
      yField: "day",
      barStyle: {
        radius: [20, 20, 0, 0],
      },
      autoFit: false,
      maxBarWidth: 20,
      color: "#5c0011",
      appendPadding: [30, 50, 0, 0],
      label: {
        position: "right",
        autoHide: true,
        autoRotate: true,
        autoEllipsis: true,
        style: {
          fill: "black",
          opacity: 1,
          fontSize: 16,
        },
      },
      yAxis: {
        label: {
          autoHide: false,
          autoRotate: true,
          style: {
            fill: "black",
            fontSize: 16,
          },
        },
      },
      xAxis: false,
    };
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const graphByDayType = vw >= 768 ? "Column" : "Bar";
    const config = graphByDayType === "Column" ? columnConfig : barConfig;
    if (graphByDayType === "Bar") {
      if (this.state.graphByDayConfig.data.length <= 10) {
        config.height = 200;
      } else if (this.state.graphByDayConfig.data.length <= 20) {
        config.height = config.height = 400;
      } else {
        config.height = config.height = 700;
      }
    }

    this.setState({
      graphByDayType,
      graphByDayConfig: {
        data: this.state.graphByDayConfig.data,
        ...config,
      },
    });
  };

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
      graphByWeekConfig: {
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
    let dataIndex = 0;
    const data = { months: [] };
    const datesInterval = eachDayOfInterval({
      start: new Date("2023-10-07T00:00"),
      end: getToday(),
    });

    datesInterval.forEach((dateInterval) => {
      const monthName = dateInterval.toLocaleString("default", {
        month: "long",
      });
      if (!data.months.includes(monthName)) {
        data.months.push(monthName);
        data[monthName] = [];
      }

      if (dataIndex >= alertsPerDay.length) {
        data[monthName].push({ day: dayOfMonthFormat(dateInterval), count: 0 });
      } else {
        const [year, month, day] = alertsPerDay[dataIndex].timeStamp.split("-");
        const dateOfAlerts = new Date(year, month - 1, day);
        /* If there's alert data for this dateInterval, use it
           Otherwise, there's no alert data since alerts = 0
        */
        if (isSameDay(dateInterval, dateOfAlerts)) {
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: alertsPerDay[dataIndex].alerts,
          });
          dataIndex = dataIndex + 1;
        } else {
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: 0,
          });
        }
      }
    });

    const selectedMonth = data.months[data.months.length - 1];

    this.setState({
      showGraphByDay: true,
      byDayData: data,
      selectedMonth,
      graphByDayConfig: {
        data: data[selectedMonth],
      },
    });

    this.updateGraphType();
  };

  handleMonthClick = (month) => {
    window.gtag("event", "alert_by_day_graph_month_click", {
      month,
    });
    this.setState({
      selectedMonth: month,
      graphByDayConfig: {
        ...this.state.graphByDayConfig,
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
                  <Column {...this.state.graphByWeekConfig} />
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
                  {this.state.graphByDayType === "Column" ? (
                    <Column {...this.state.graphByDayConfig} />
                  ) : (
                    <Bar {...this.state.graphByDayConfig} />
                  )}
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
