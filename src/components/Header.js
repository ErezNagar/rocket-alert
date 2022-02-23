import React from "react";
import PropTypes from "prop-types";
import { TwitterOutlined } from "@ant-design/icons";
import logo from "../logo.svg";
import { getPastMonth, getPastWeek, getToday, isoFormat } from "../date_helper";
import { differenceInMonths } from "date-fns";
import FadeIn from "./FadeIn";
import { Statistic } from "antd";
import FadeInOut from "./FadeInOut";

const today = isoFormat(getToday());
// const today = "2021-05-20";
const week = isoFormat(getPastWeek());
// const week = "2021-05-13";
const month = isoFormat(getPastMonth());
// const month = "2021-04-13";

const HeaderContent = ({
  alertSummaryTitle,
  alertSummaryText,
  alertSummaryCount,
}) => (
  <>
    {alertSummaryCount > 0 && (
      <FadeIn show={true} fadeInOnly>
        <Statistic value={alertSummaryCount} />
      </FadeIn>
    )}
    <h3>{alertSummaryTitle}</h3>
    <div className="summary-text">{alertSummaryText}</div>
  </>
);

HeaderContent.propTypes = {
  alertSummaryTitle: PropTypes.string,
  alertSummaryText: PropTypes.string,
  alertSummaryCount: PropTypes.number,
};
HeaderContent.defaultProps = {
  alertSummaryTitle: "",
  alertSummaryText: "",
  alertSummaryCount: 0,
};

const AlertModeHeaderContent = ({ shouldRefresh, alert, todayAlertCount }) => (
  <>
    <h3>Rocket alert</h3>
    <div className="alert">
      <FadeInOut show={shouldRefresh}>
        {alert.englishName || alert.name}
      </FadeInOut>
    </div>
    {todayAlertCount > 0 && (
      <>
        <div className="alert-summary-count">
          <FadeIn show={true} fadeInOnly>
            <Statistic value={todayAlertCount} />
          </FadeIn>
        </div>
        <div className="alert-summary-text">{"Rocket alerts today"}</div>
      </>
    )}
  </>
);

AlertModeHeaderContent.propTypes = {
  shouldRefresh: PropTypes.bool,
  alert: PropTypes.object,
  alertSummaryCount: PropTypes.number,
};
AlertModeHeaderContent.defaultProps = {
  shouldRefresh: false,
  alert: {},
  alertSummaryCount: 0,
};

class Header extends React.Component {
  state = {
    alerts: {},
    todayAlertCount: 0,
    weekAlertCount: 0,
    monthAlertCount: 0,
    alertSummaryCount: 0,
    alertSummaryTitle: "",
    alertSummaryText: "",
    isLoading: true,
    isError: false,
    shouldRefresh: false,
  };

  componentDidMount() {
    const alertClient = this.props.alertClient;
    Promise.all([
      alertClient.getTotalAlerts(today, today),
      // alertClient.getTotalAlerts(week, null),
      alertClient.getTotalAlerts(week, today),
      alertClient.getTotalAlerts(month, today),
    ])
      .then((values) => {
        this.setState(
          {
            todayAlertCount: values[0].payload,
            weekAlertCount: values[1].payload,
            monthAlertCount: values[2].payload,
          },
          () => {
            this.setAlertSummary();
          }
        );
      })
      .catch((error) => {
        console.error(error);
        this.setState({ isError: true });
      });
  }

  /* Sets rocket alert summary in a simple, "human readable" form.
   * Prioritize recent alerts over old ones.
   */
  setAlertSummary = () => {
    let alertSummaryTitle = "";
    let alertSummaryText = "";
    let alertSummaryCount = 0;

    if (this.state.todayAlertCount > 0) {
      alertSummaryCount = this.state.todayAlertCount;
      alertSummaryTitle = `Rocket alerts today`;
      if (this.state.weekAlertCount > 0) {
        alertSummaryText = `Last week, there were ${this.state.weekAlertCount} rocket alerts`;
        if (this.state.monthAlertCount > 0) {
          alertSummaryText += `,\nand a total of ${this.state.monthAlertCount} in the past month`;
        }
      } else if (this.state.monthAlertCount > 0) {
        alertSummaryText = `In the past month, there were ${this.state.monthAlertCount} rocket alerts`;
      }
    } else if (this.state.weekAlertCount > 0) {
      alertSummaryCount = this.state.weekAlertCount;
      alertSummaryTitle = `Rocket alerts in the last week`;
      if (
        this.state.monthAlertCount > 0 &&
        this.state.monthAlertCount !== this.state.weekAlertCount
      ) {
        alertSummaryText += `In the past month, there were ${this.state.monthAlertCount} rocket alerts`;
      }
    } else if (this.state.monthAlertCount > 0) {
      alertSummaryCount = this.state.monthAlertCount;
      alertSummaryTitle = `Rocket alerts in the last month`;
    } else {
      this.props.alertClient
        .getMostRecentAlert()
        .then((res) => {
          if (res.success) {
            const monthsAgo = differenceInMonths(
              new Date(today),
              new Date(res.payload.date)
            );
            alertSummaryTitle = `Last rocket alert was ${monthsAgo} months ago`;
          }
        })
        .catch((err) => {
          console.error("Error getMostRecentAlert()", err);
        });
    }
    this.setState({ alertSummaryCount, alertSummaryTitle, alertSummaryText });
  };

  componentDidUpdate(prevProps) {
    if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
      this.refreshAlert(this.props.realTimeAlert);
    }
  }

  refreshAlert = () => {
    this.setState({
      shouldRefresh: true,
    });
    setTimeout(() => {
      this.setState({ shouldRefresh: false });
    }, 2000);
  };

  render() {
    return (
      <header
        className={this.props.isAlertMode ? "header alert-mode" : "header"}
      >
        <div className="header-top">
          <img className="logo" src={logo} alt="" />
          <h2>Real-time rocket alerts in Israel</h2>
        </div>
        <div className="header-content">
          {!this.state.isError && this.props.isAlertMode && (
            <AlertModeHeaderContent
              shouldRefresh={this.state.shouldRefresh}
              alert={this.props.realTimeAlert}
              todayAlertCount={this.state.todayAlertCount}
            />
          )}
          {!this.state.isError && !this.props.isAlertMode && (
            <HeaderContent
              alertSummaryTitle={this.state.alertSummaryTitle}
              alertSummaryText={this.state.alertSummaryText}
              alertSummaryCount={this.state.alertSummaryCount}
            />
          )}
          {this.state.isError && (
            <h3 className="error">Data is currently unavailable</h3>
          )}
        </div>
        <div className="header-bottom">
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
              <TwitterOutlined style={{ fontSize: "20px", color: "white" }} />
            </div>
            <div>#RocketAlert</div>
          </a>
        </div>
      </header>
    );
  }
}

Header.propTypes = {
  alertClient: PropTypes.object.isRequired,
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.object,
};

Header.defaultProps = {
  isAlertMode: false,
  realTimeAlert: {},
};

export default Header;
