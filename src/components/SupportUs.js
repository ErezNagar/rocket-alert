import { Row, Col } from "antd";
import { ReactComponent as ByMeCoffee } from "../assets/coffeecup.svg";

const SupportUs = () => (
  <Row justify="center" align="middle" className="support-us">
    <Row>
      <Col>
        {"Please consider supporting us by "}
        <a
          href="https://www.buymeacoffee.com/RocketAlertLive"
          target="_blank"
          rel="noreferrer"
          style={{
            color: "black",
            textDecoration: "underline",
          }}
        >
          {"buying us coffee"}
        </a>
      </Col>
      <Col>
        <a
          href="https://www.buymeacoffee.com/RocketAlertLive"
          target="_blank"
          rel="noreferrer"
        >
          <ByMeCoffee style={{ height: "20px" }} />
        </a>
      </Col>
    </Row>
    <Row>
      <Col>
        {"Your donation helps cover the costs of maintaining the site."}
      </Col>
    </Row>
  </Row>
);

export default SupportUs;
