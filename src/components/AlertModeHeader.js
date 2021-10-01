import PropTypes from "prop-types";
import Tile from "./Tile";
import LiveAlerts from "./LiveAlerts";
import { TwitterOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

const AlertModeHeader = (props) => (
  <header className="alert-mode-header">
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
  randomString: PropTypes.string,
  getYesterday() {},
  alertClient: PropTypes.object.isRequired,
};

AlertModeHeader.defaultProps = {
  randomString: "",
  getYesterday: () => {},
};

export default AlertModeHeader;
