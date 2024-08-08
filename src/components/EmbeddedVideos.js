import { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import Util from "../util";
import Tracking from "../tracking";

const EmbeddedVideos = () => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("EmveddedVideos");
    }
  }, [isVisible]);

  return (
    <div ref={ref}>
      <Row justify="center">
        <Col xs={24} sm={12} md={8} lg={6} xxl={4}>
          <blockquote className="twitter-tweet" data-media-max-width="560">
            <p lang="en" dir="ltr">
              Another footage showing Iron Dome’s “Tamir” missiles intercept
              dozens of rockets fired towards the city of Kiryat Shmona in
              Northern Israel, just an hour ago
              <a href="https://t.co/iEhH3JNv9l">pic.twitter.com/iEhH3JNv9l</a>
            </p>
            &mdash; Rocket Alert (@rocketalertlive)
            <a href="https://twitter.com/rocketalertlive/status/1819872832912085223?ref_src=twsrc%5Etfw">
              August 3, 2024
            </a>
          </blockquote>
        </Col>
        <Col xs={0} sm={12} md={8} lg={6} xxl={4}>
          <blockquote className="twitter-tweet" data-media-max-width="560">
            <p lang="en" dir="ltr">
              Multiple rocket alerts today in Kiryat Shmona (northern Israel)
              <a href="https://t.co/E8BrzFziDQ">pic.twitter.com/E8BrzFziDQ</a>
            </p>
            &mdash; Rocket Alert (@rocketalertlive)
            <a href="https://twitter.com/rocketalertlive/status/1773059029595541755?ref_src=twsrc%5Etfw">
              March 27, 2024
            </a>
          </blockquote>
        </Col>
        <Col xs={0} sm={0} md={8} lg={6} xxl={4}>
          <blockquote className="twitter-tweet" data-media-max-width="560">
            <p lang="en" dir="ltr">
              Footage showing interception by Iron Dome over the upper Galilee
              region in Northern Israel, following the rocket barrage fired by
              Hezbollah an hour ago
              <a href="https://t.co/nfWd2vzYEt">pic.twitter.com/nfWd2vzYEt</a>
            </p>
            &mdash; Rocket Alert (@rocketalertlive)
            <a href="https://twitter.com/rocketalertlive/status/1819871068976263315?ref_src=twsrc%5Etfw">
              August 3, 2024
            </a>
          </blockquote>
        </Col>
        <Col xs={0} sm={0} md={0} lg={6} xxl={4}>
          <blockquote className="twitter-tweet" data-media-max-width="560">
            <p lang="en" dir="ltr">
              Moments showing suicide UAV launched by Hezbollah hit the Northern
              Israeli Town of Arab al-Aramshe this morning.
              <a href="https://twitter.com/hashtag/israelunderattack?src=hash&amp;ref_src=twsrc%5Etfw">
                #israelunderattack
              </a>
              <a href="https://t.co/uCSo25jvTC">pic.twitter.com/uCSo25jvTC</a>
            </p>
            &mdash; Rocket Alert (@rocketalertlive)
            <a href="https://twitter.com/rocketalertlive/status/1780588891331854386?ref_src=twsrc%5Etfw">
              April 17, 2024
            </a>
          </blockquote>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xxl={4}>
          <blockquote className="twitter-tweet" data-media-max-width="560">
            <p lang="en" dir="ltr">
              A video capturing the Unmanned Aerial Vehicle (UAV), aka “suicide
              drone”, fired by Yemen’s Houthi rebel, hit the streets of Tel Aviv
              last night.{" "}
              <a href="https://t.co/KrZH8U6rHQ">pic.twitter.com/KrZH8U6rHQ</a>
            </p>
            &mdash; Rocket Alert (@rocketalertlive)
            <a href="https://twitter.com/rocketalertlive/status/1814303616498290955?ref_src=twsrc%5Etfw">
              July 19, 2024
            </a>
          </blockquote>
        </Col>
        <Col xs={0} sm={0} md={0} lg={0} xxl={4}>
          <blockquote className="twitter-tweet" data-media-max-width="560">
            <p lang="en" dir="ltr">
              Several rockets fired towards Northern Israel in the past hour by
              Hezbollah. This footage from the city of Kiryat Shmona (~23k
              population) shows multiple interceptions by the Iron Dome air
              defense system.
              <a href="https://t.co/GGv4TFd8xZ">pic.twitter.com/GGv4TFd8xZ</a>
            </p>
            &mdash; Rocket Alert (@rocketalertlive)
            <a href="https://twitter.com/rocketalertlive/status/1812176422787502481?ref_src=twsrc%5Etfw">
              July 13, 2024
            </a>
          </blockquote>
        </Col>
      </Row>
    </div>
  );
};

EmbeddedVideos.propTypes = {};

EmbeddedVideos.defaultProps = {};

export default EmbeddedVideos;
