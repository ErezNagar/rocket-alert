import PropTypes from "prop-types";
import Tile from "./Tile";
import LiveAlerts from "./LiveAlerts";
import { Row, Col } from "antd";

const AlertModeHeader = (props) => (
  <header className="header alert-mode">
    <Row>
      <Col xs={24} sm={15} lg={15}>
        <div className="title">
          <h1>Rocket Alerts</h1>
          <h2>Real-time rocket alerts in Israel</h2>
        </div>
        <Tile
          isHeroTile
          title={"alerts today"}
          subtitle={props.getYesterday()}
          fromDate={props.getYesterday()}
          alertsClient={props.alertClient}
        />
      </Col>
      <Col xs={24} sm={9} lg={9}>
        <LiveAlerts />
      </Col>
    </Row>
  </header>
);

AlertModeHeader.propTypes = {
  getYesterday() {},
  alertClient: PropTypes.object.isRequired,
};

AlertModeHeader.defaultProps = {
  getYesterday: () => {},
};

export default AlertModeHeader;
