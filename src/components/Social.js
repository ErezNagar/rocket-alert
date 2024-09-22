import { useEffect, useRef, useMemo } from "react";
import { Row, Col } from "antd";
import Util from "../util";
import Tracking from "../tracking";

const Post1 = () => (
  <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      Another footage showing Iron Dome’s “Tamir” missiles intercept dozens of
      rockets fired towards the city of Kiryat Shmona in Northern Israel, just
      an hour ago
      <a href="https://t.co/iEhH3JNv9l">pic.twitter.com/iEhH3JNv9l</a>
    </p>
    &mdash; Rocket Alert (@rocketalertlive)
    <a href="https://twitter.com/rocketalertlive/status/1819872832912085223?ref_src=twsrc%5Etfw">
      August 3, 2024
    </a>
  </blockquote>
);

const Post2 = () => (
  <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      Several rockets fired towards Northern Israel in the past hour by
      Hezbollah. This footage from the city of Kiryat Shmona (~23k population)
      shows multiple interceptions by the Iron Dome air defense system.
      <a href="https://t.co/GGv4TFd8xZ">pic.twitter.com/GGv4TFd8xZ</a>
    </p>
    &mdash; Rocket Alert (@rocketalertlive)
    <a href="https://twitter.com/rocketalertlive/status/1812176422787502481?ref_src=twsrc%5Etfw">
      July 13, 2024
    </a>
  </blockquote>
);

const Post3 = () => (
  <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      Iron Dome Tamir interceptors above the Knesset, the Israeli Parliament,
      tonight. <a href="https://t.co/qdJE7bRJiu">pic.twitter.com/qdJE7bRJiu</a>
    </p>
    &mdash; Rocket Alert (@rocketalertlive)
    <a href="https://twitter.com/rocketalertlive/status/1779297974977192392?ref_src=twsrc%5Etfw">
      April 13, 2024
    </a>
  </blockquote>
);

const Post4 = () => (
  <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      A video capturing the Unmanned Aerial Vehicle (UAV), aka “suicide drone”,
      fired by Yemen’s Houthi rebel, hit the streets of Tel Aviv last night.
      <a href="https://t.co/KrZH8U6rHQ">pic.twitter.com/KrZH8U6rHQ</a>
    </p>
    &mdash; Rocket Alert (@rocketalertlive)
    <a href="https://twitter.com/rocketalertlive/status/1814303616498290955?ref_src=twsrc%5Etfw">
      July 19, 2024
    </a>
  </blockquote>
);

const Post5 = () => (
  <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      Multiple rocket alerts today in Kiryat Shmona (northern Israel)
      <a href="https://t.co/E8BrzFziDQ">pic.twitter.com/E8BrzFziDQ</a>
    </p>
    &mdash; Rocket Alert (@rocketalertlive)
    <a href="https://twitter.com/rocketalertlive/status/1773059029595541755?ref_src=twsrc%5Etfw">
      March 27, 2024
    </a>
  </blockquote>
);

const Post6 = () => (
  <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      Footage showing interception by Iron Dome over the upper Galilee region in
      Northern Israel, following the rocket barrage fired by Hezbollah an hour
      ago <a href="https://t.co/nfWd2vzYEt">pic.twitter.com/nfWd2vzYEt</a>
    </p>
    &mdash; Rocket Alert (@rocketalertlive)
    <a href="https://twitter.com/rocketalertlive/status/1819871068976263315?ref_src=twsrc%5Etfw">
      August 3, 2024
    </a>
  </blockquote>
);

const Post7 = () => (
  <blockquote className="twitter-tweet">
    <p lang="en" dir="ltr">
      Iron Dome’s “Tamir” missile interceptors maneuver sharply, as seen earlier
      today in the skies of Northern Israel{" "}
      <a href="https://t.co/1Aosoeq3xu">pic.twitter.com/1Aosoeq3xu</a>
    </p>
    &mdash; Rocket Alert (@rocketalertlive)
    <a href="https://twitter.com/rocketalertlive/status/1837474110365954141?ref_src=twsrc%5Etfw">
      September 21, 2024
    </a>
  </blockquote>
);

const Social = () => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);
  const randomId = useMemo(() => Math.floor(Math.random() * 7), []);
  const posts = [Post1, Post2, Post3, Post4, Post5, Post6, Post7];
  const RandomPost = posts[randomId];

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("Social");
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="section">
      <Row justify="center">
        <Col>
          <RandomPost />
        </Col>
      </Row>
    </section>
  );
};

Social.propTypes = {};

Social.defaultProps = {};

export default Social;
