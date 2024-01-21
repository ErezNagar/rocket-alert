import PropTypes from "prop-types";
import React from "react";
import { Row, Col, Button } from "antd";
import Tile from "./Tile";
import { eachDayOfInterval, isSameDay } from "date-fns";
import {
  getNow,
  getYesterday,
  dayOfMonthFormat,
  isBiWeeklyDifference,
  weekRangeFormat,
} from "../date_helper";
import { Column, Bar } from "@ant-design/plots";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";

class CurrentOperation extends React.Component {
  state = {
    data: [],
    showGraphByWeek: false,
    showGraphByDay: false,
    graphByDayType: "Column",
    graphByWeekConfig: null,
    selectedMonth: null,
    graphByDayConfig: null,
    isLoadingChart: false,
  };

  componentDidMount() {
    this.getTotalAlertsByDay().then((alertsPerDay) => {
      if (!alertsPerDay || alertsPerDay.length === 0) {
        return;
      }
      this.buildAlertsByWeekGraph(alertsPerDay);
      this.buildAlertsByDayGraph(alertsPerDay);
    });

    window.addEventListener("resize", this.updateGraphConfig);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateGraphConfig);
  }

  updateGraphConfig = () => {
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

    // We need to "reset" graphByDayType for Ant Design chart to re-render properly
    this.setState({ graphByDayType: null, isLoadingChart: true }, () => {
      setTimeout(() => {
        this.setState({
          isLoadingChart: false,
          graphByDayType,
          graphByDayConfig: {
            data: this.state.graphByDayConfig.data,
            ...config,
          },
        });
      }, 10);
    });
  };

  getTotalAlertsByDay = () =>
    this.props.alertsClient
      .getTotalAlertsByDay(new Date("2023-10-07"), getNow())
      .then((res) => {
        return res.payload;
      })
      .catch((error) => {
        Tracking.totalAlertsByDayError(error);
        console.error(error);
        return null;
      });

  buildAlertsByWeekGraph = (alertsPerDay) => {
    // Alerts By Month

    // let data = [];
    // let monthlyAlertCount = 0;
    // let currentMonth = "10"; // Starting from October
    // alertsPerDay.forEach(({ alerts, timeStamp }) => {
    //   const [year, month, day] = timeStamp.split("-");
    //   if (currentMonth !== month) {
    //     data.push({
    //       month: currentMonth,
    //       count: monthlyAlertCount,
    //     });
    //     currentMonth = month;
    //     monthlyAlertCount = 0;
    //   }

    //   monthlyAlertCount += alerts;
    // });

    // data.push({
    //   month: currentMonth,
    //   count: monthlyAlertCount,
    // });
    let data = [];
    let biweeklyAlertCount = 0;
    let weekDate = new Date(2023, 9, 7);
    alertsPerDay.forEach(({ alerts, timeStamp }) => {
      const [year, month, day] = timeStamp.split("-");
      const date = new Date(year, month - 1, day);
      if (isBiWeeklyDifference(weekDate, date)) {
        data.push({
          week: weekRangeFormat(weekDate, date),
          count: biweeklyAlertCount,
        });
        weekDate = date;
        biweeklyAlertCount = 0;
      }

      biweeklyAlertCount += alerts;
    });

    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getNow())}`,
      count: biweeklyAlertCount,
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
              fontSize: 14,
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
      end: getYesterday(),
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

    this.updateGraphConfig();
  };

  handleMonthClick = (month) => {
    Tracking.graphMonthClick(month);
    this.setState(
      {
        selectedMonth: month,
        graphByDayConfig: {
          ...this.state.graphByDayConfig,
          data: this.state.byDayData[month],
        },
      },
      () => {
        this.updateGraphConfig();
      }
    );
  };

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
        {(this.state.showGraphByWeek || this.state.showGraphByDay) && (
          <div className="current-operation-graph">
            <Row gutter={[24, 24]} justify={"center"}>
              {this.state.showGraphByWeek && (
                <Col span={24}>
                  <h2>Bi-weekly alerts since Oct 7</h2>
                  <Column {...this.state.graphByWeekConfig} />
                </Col>
              )}
              {this.state.showGraphByDay && (
                <Col span={24}>
                  <h2>Alerts by day since Oct 7</h2>
                  <Row justify={"center"} className={"month-list"}>
                    {this.state.byDayData.months.map((month) => (
                      <Col xs={24} md={4} lg={3} key={month}>
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
                  {this.state.isLoadingChart && (
                    <Row
                      gutter={[24, 24]}
                      justify={"center"}
                      align={"middle"}
                      className={"loading-chart"}
                    ></Row>
                  )}
                  {this.state.graphByDayType === "Column" && (
                    <Column {...this.state.graphByDayConfig} />
                  )}
                  {this.state.graphByDayType === "Bar" && (
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
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(CurrentOperation, "CurrentOperation");
