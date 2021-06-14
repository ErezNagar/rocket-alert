import React from "react";
import "./App.css";
import AlertClient from "./alert_client";

class App extends React.Component {
  state = {
    alerts: {},
  };
  componentDidMount() {
    AlertClient.getTotalAlertsByDay("2021-05-01", "2021-06-01")
      .then((res) => {
        this.setState({ alerts: res });
      })
      .catch((error) => console.log("error", error));
  }

  render() {
    return (
      <div className="pageContainer">
        <header>
          <h1>Code Red - Rocket Alerts in Israel</h1>
        </header>
        <div className="pageBody">{JSON.stringify(this.state.alerts)}</div>
        <footer></footer>
      </div>
    );
  }
}

export default App;
