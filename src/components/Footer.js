import { Row, Col } from "antd";
import Tracking from "../tracking";
import { useEffect, useRef } from "react";
import Util from "../util";
import { ReactComponent as TwitterLogo } from "../assets/twitter.svg";
import { ReactComponent as TelegramLogo } from "../assets/telegram.svg";
import { ReactComponent as MastodonLogo } from "../assets/mastodon.svg";
import { ReactComponent as EmailLogo } from "../assets/email.svg";

const Footer = () => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("footer");
    }
  }, [isVisible]);

  return (
    <footer ref={ref}>
      <Row justify="center" align="top">
        <Col xs={8} md={4} lg={3}>
          <div className="title">Live Alert Feed</div>
          {/* <Row align="middle">
            <Col>
              <a
                href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
                target="_blank"
                rel="noreferrer"
                onClick={()=>Tracking.socialFooterClick("twitterbot")}
              >
                <TwitterLogo className="icon" />
              </a>
            </Col>
            <Col>Twitter</Col>
          </Row> */}
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
};

export default Footer;
