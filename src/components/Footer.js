import PropTypes from "prop-types";
import { TwitterOutlined, MailOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";

const Footer = ({ twitterShareText }) => (
  <footer>
    <Row align="middle" justify="center" style={{ textAlign: "center" }}>
      <Col>
        <Row justify="center">
          <Col span={24}>
            <a
              href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
              target="_blank"
              rel="noreferrer"
            >
              <TwitterOutlined style={{ fontSize: "24px", color: "white" }} />
            </a>
          </Col>
          <Col span={24}>
            <a
              href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
              target="_blank"
              rel="noreferrer"
            >
              Share
            </a>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row justify="center">
          <Col span={24}>
            <a href={"mailto: rocketalertlive@gmail.com"}>
              <MailOutlined style={{ fontSize: "24px", color: "white" }} />
            </a>
          </Col>
          <Col span={24}>
            <a href={"mailto: rocketalertlive@gmail.com"}>Contact Us</a>
          </Col>
        </Row>
      </Col>
    </Row>
  </footer>
);

Footer.propTypes = {
  // Text to share on twitter. Generated in Header
  twitterShareText: PropTypes.string,
};

Footer.defaultProps = {
  twitterShareText: "",
};

export default Footer;
