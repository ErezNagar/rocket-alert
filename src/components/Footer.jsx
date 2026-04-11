import { Row, Col } from "antd";
import PropTypes from "prop-types";
import Tracking from "../tracking";
import withIsVisibleHook from "./withIsVisibleHook";
import TwitterLogo from "../assets/twitter.svg?react";
import TelegramLogo from "../assets/telegram.svg?react";
import MastodonLogo from "../assets/mastodon.svg?react";
import EmailLogo from "../assets/email.svg?react";
import InstagramLogo from "../assets/instagram.svg?react";

const Footer = ({ isIntersectingRef }) => (
  <footer ref={isIntersectingRef}>
    <Row justify="center" align="top">
      <Col xs={8} md={4} lg={3}>
        <div className="title">Live Alert Feed</div>
        <Row className="item">
          <Col>
            <a
              href={"https://t.me/RocketAlert"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("telegram")}
            >
              <TelegramLogo className="icon" />
            </a>
          </Col>
          <Col>
            <a
              href={"https://t.me/RocketAlert"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("telegram")}
            >
              Telegram
            </a>
          </Col>
        </Row>
        <Row className="item">
          <Col>
            <a
              href={"https://mastodon.social/@rocketalert"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("mastodon")}
            >
              <MastodonLogo className="icon" />
            </a>
          </Col>
          <Col>
            <a
              href={"https://mastodon.social/@rocketalert"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("mastodon")}
            >
              Mastodon
            </a>
          </Col>
        </Row>
      </Col>
      <Col>
        <div className="title">Connect</div>
        <Row className="item">
          <Col>
            <a
              href={"https://x.com/rocketalertlive"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("twitter")}
            >
              <TwitterLogo className="icon" />
            </a>
          </Col>
          <Col>
            <a
              href={"https://x.com/rocketalertlive"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("twitter")}
            >
              Twitter
            </a>
          </Col>
        </Row>
        <Row className="item">
          <Col>
            <a
              href={"https://www.instagram.com/RocketAlertLive/"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("instagram")}
            >
              <InstagramLogo className="icon" />
            </a>
          </Col>
          <Col>
            <a
              href={"https://www.instagram.com/RocketAlertLive/"}
              target="_blank"
              rel="noreferrer"
              onClick={() => Tracking.socialFooterClick("instagram")}
            >
              Instagram
            </a>
          </Col>
        </Row>
        <Row className="item">
          <Col>
            <a href={"mailto: rocketalertlive@gmail.com"}>
              <EmailLogo className="icon" />
            </a>
          </Col>
          <Col>
            <a href={"mailto: rocketalertlive@gmail.com"}>Contact Us</a>
          </Col>
        </Row>
      </Col>
    </Row>
  </footer>
);

Footer.propTypes = {
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(Footer, "Footer");
