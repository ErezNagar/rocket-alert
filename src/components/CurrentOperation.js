import PropTypes from "prop-types";
import React from "react";
import { Row, Col } from "antd";
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
import Util from "../util";
import PreviousStats from "./PreviousStats";

const GRAPH_CONFIG = {
  ALERTS_BY_WEEKS: {
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
  ALERTS_BY_DAY: {
    COLUMN: {
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
            fontSize: 14,
          },
        },
      },
      yAxis: false,
    },
    BAR: {
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
    },
  },
  ALERTS_BY_SOURCE: {
    COLUMN: {
      xField: "week",
      yField: "count",
      isGroup: true,
      seriesField: "origin",
      // columnWidthRatio: 0.5,
      columnStyle: {
        radius: [20, 20, 0, 0],
      },
      color: ["#008000", "#F7E210", "#5c0011"],
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
      legend: {
        layout: "horizontal",
        position: "top",
      },
    },
    BAR: {
      xField: "count",
      yField: "week",
      isGroup: true,
      seriesField: "origin",
      barStyle: {
        radius: [20, 20, 0, 0],
      },
      legend: {
        layout: "horizontal",
        position: "top-left",
      },
      autoFit: false,
      maxBarWidth: 40,
      minBarWidth: 13,
      color: ["#008000", "#F7E210", "#5c0011"],
      appendPadding: [0, 50, 0, 0],
      dodgePadding: 5,
      intervalPadding: 15,
      label: {
        position: "right",
        autoHide: true,
        autoRotate: true,
        autoEllipsis: true,
        style: {
          fill: "black",
          opacity: 1,
          fontSize: 14,
        },
      },
      yAxis: {
        label: {
          autoHide: false,
          autoRotate: true,
          style: {
            fill: "black",
            fontSize: 14,
          },
        },
      },
      xAxis: false,
    },
  },
};

class CurrentOperation extends React.Component {
  state = {
    data: [],
    showGraphByWeek: false,
    showGraphByDay: false,
    showGraphByOrigin: false,
    graphByDayType: "Column",
    graphBySourceType: "Column",
    graphByWeekConfig: null,
    graphByDayConfig: null,
    graphBySourceConfig: null,
    selectedMonth: null,
    isLoadingChart: false,
    mostTargetedLocations: null,
    mostTargetedRegions: null,
  };

  componentDidMount() {
    this.getDetailedAlerts().then((alerts) => {
      if (!alerts || alerts.length === 0) {
        return;
      }
      this.buildAlertsByWeekGraph(alerts);
      this.buildAlertsByDayGraph(alerts);
      this.buildAlertsBySourceGraph(alerts);
      this.updateGraphConfig();
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

    // window.addEventListener("resize", this.updateGraphConfig);
  }

  componentWillUnmount() {
    // window.removeEventListener("resize", this.updateGraphConfig);
  }

  updateGraphConfig = () => {
    const vw = Math.max(
      document.documentElement.clientWidth || 0,
      window.innerWidth || 0
    );
    const type = vw >= 768 ? "Column" : "Bar";
    let height = 200;
    if (type === "Bar") {
      if (this.state.graphByDayConfig.data.length <= 10) {
        height = 200;
      } else if (this.state.graphByDayConfig.data.length <= 20) {
        height = 400;
      } else {
        height = 550;
      }
    }

    this.setState({
      graphByDayType: type,
      graphBySourceType: type,
      graphByDayConfig: {
        data: this.state.graphByDayConfig.data,
        ...(type === "Column"
          ? GRAPH_CONFIG.ALERTS_BY_DAY.COLUMN
          : GRAPH_CONFIG.ALERTS_BY_DAY.BAR),
        height: type === "Column" ? 400 : height,
      },
      graphBySourceConfig: {
        data: this.state.graphBySourceConfig.data,
        ...(type === "Column"
          ? GRAPH_CONFIG.ALERTS_BY_SOURCE.COLUMN
          : GRAPH_CONFIG.ALERTS_BY_SOURCE.BAR),
        height: 550,
      },
    });

    // To apply a new height, We need to "reset" graphByDayType for Ant Design chart to re-render properly
    this.setState({ graphByDayType: null, isLoadingChart: true }, () => {
      setTimeout(() => {
        this.setState({
          isLoadingChart: false,
          graphByDayType: type,
          graphByDayConfig: {
            ...this.state.graphByDayConfig,
            height: type === "Column" ? 400 : height,
          },
        });
      }, 10);
    });
  };

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
    alertsPerDay.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (isBiWeeklyDifference(weekDate, theDate)) {
        data.push({
          week: weekRangeFormat(weekDate, theDate),
          count: biweeklyAlertCount,
        });
        weekDate = theDate;
        biweeklyAlertCount = 0;
      }

      biweeklyAlertCount += alerts.length;
    });

    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getNow())}`,
      count: biweeklyAlertCount,
    });

    this.setState({
      showGraphByWeek: true,
      graphByWeekConfig: {
        data,
        ...GRAPH_CONFIG.ALERTS_BY_WEEKS,
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
        const [year, month, day] = alertsPerDay[dataIndex].date.split("-");
        const dateOfAlerts = new Date(year, month - 1, day);
        /* If there's alert data for this dateInterval, use it
           Otherwise, there's no alert data since alerts = 0
        */
        if (isSameDay(dateInterval, dateOfAlerts)) {
          data[monthName].push({
            day: dayOfMonthFormat(dateInterval),
            count: alertsPerDay[dataIndex].alerts.length,
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
  };

  buildAlertsBySourceGraph = (alertsPerDay) => {
    let data = [];
    let originSouthCount = 0;
    let originNorthCount = 0;
    let weekDate = new Date(2023, 9, 7);
    alertsPerDay.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (isBiWeeklyDifference(weekDate, theDate)) {
        data.push({
          week: weekRangeFormat(weekDate, theDate),
          count: originSouthCount,
          origin: "Gaza / Hamas",
        });
        data.push({
          week: weekRangeFormat(weekDate, theDate),
          count: originNorthCount,
          origin: "Southern Lebanon / Hezbollah",
        });
        weekDate = theDate;
        originSouthCount = 0;
        originNorthCount = 0;
      }

      let originSouth = 0;
      let originNorth = 0;
      alerts.forEach((alert) => {
        if (Util.isRegionInSouth(alert.areaNameEn)) {
          originSouth += 1;
        } else if (Util.isRegionInNorth(alert.areaNameEn)) {
          originNorth += 1;
        }
      });

      originSouthCount += originSouth;
      originNorthCount += originNorth;
    });

    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getNow())}`,
      count: originSouthCount,
      origin: "Gaza / Hamas",
    });
    data.push({
      week: `${dayOfMonthFormat(weekDate)} - ${dayOfMonthFormat(getNow())}`,
      count: originNorthCount,
      origin: "Southern Lebanon / Hezbollah",
    });

    this.setState({
      showGraphByOrigin: true,
      graphBySourceConfig: {
        data,
      },
    });
  };

  handleMonthClick = () => {
    const month = document.getElementById("month-select").value;
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
        <PreviousStats alertsClient={this.props.alertsClient} />
        {(this.state.showGraphByWeek ||
          this.state.showGraphByDay ||
          this.state.showGraphByOrigin) && (
          <div className="current-operation-graph">
            <Row gutter={[24, 24]} justify={"center"}>
              {this.state.showGraphByWeek && (
                <Col span={24}>
                  <h2>Total Alerts since Oct 7</h2>
                  <Column {...this.state.graphByWeekConfig} />
                </Col>
              )}
              {this.state.showGraphByOrigin && (
                <>
                  <Col span={24}>
                    <h2>Alerts by source since Oct 7</h2>
                    {this.state.graphBySourceType === "Column" && (
                      <Column {...this.state.graphBySourceConfig} />
                    )}
                    {this.state.graphBySourceType === "Bar" && (
                      <Bar {...this.state.graphBySourceConfig} />
                    )}
                  </Col>
                  <Col gutter={[24, 24]}>
                    Estimation only. Based on alert location and its distance
                    from the Gaza Strip vs Southern Lebanon. May include rockets
                    fired by Islamic Jihad (Gaza) or by other Iranian proxies
                    (Southern Lebanon)
                  </Col>
                </>
              )}
              {this.state.showGraphByDay && (
                <Col span={24}>
                  <h2>Alerts by day since Oct 7</h2>
                  <Row justify={"center"} className={"month-list"}>
                    <div className={"customSelect"}>
                      <select
                        id="month-select"
                        onChange={(e) => this.handleMonthClick(e)}
                      >
                        {this.state.byDayData.months.map((month, idx) =>
                          idx + 1 === this.state.byDayData.months.length ? (
                            <option
                              value={month}
                              selected="selected"
                              key={month}
                            >
                              {month}
                            </option>
                          ) : (
                            <option value={month} key={month}>
                              {month}
                            </option>
                          )
                        )}
                      </select>
                    </div>
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
              {this.state.mostTargetedLocations &&
                this.state.mostTargetedRegions && (
                  <>
                    <Col xs={24} lg={12}>
                      <h2>Most targeted communities</h2>
                      {this.state.mostTargetedLocations.map((location) => (
                        <Row justify={"center"} key={location.englishName}>
                          <Col span={18}>
                            <a
                              className="most-targeted-location"
                              href={`http://www.google.com/maps/place/${location.lat},${location.lon}/@${location.lat},${location.lon},14z`}
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
                    <Col xs={24} lg={12}>
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
