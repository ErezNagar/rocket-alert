import PropTypes from "prop-types";
import { TwitterOutlined, MailOutlined } from "@ant-design/icons";
import { Row, Col } from "antd";
import Tracking from "../tracking";
import { useEffect, useRef } from "react";
import Util from "../util";

const Footer = ({ twitterShareText }) => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("footer");
    }
  }, [isVisible]);

  return (
    <footer ref={ref}>
      <Row align="middle" justify="center" style={{ textAlign: "center" }}>
        <Col>
          <Row justify="center">
            <Col span={24}>
              <a
                href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                target="_blank"
                rel="noreferrer"
                onClick={Tracking.shareFooterClick}
              >
                <TwitterOutlined style={{ fontSize: "24px", color: "white" }} />
              </a>
            </Col>
            <Col span={24}>
              <a
                href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                target="_blank"
                rel="noreferrer"
                onClick={Tracking.shareFooterClick}
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
};

Footer.propTypes = {
  // Text to share on twitter. Generated in Header
  twitterShareText: PropTypes.string,
};

Footer.defaultProps = {
  twitterShareText: "",
};

export default Footer;
