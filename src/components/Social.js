import { useEffect, useRef } from "react";
import { Row, Col } from "antd";
import Utilities from "../utilities/utilities";
import Tracking from "../tracking";

const Social = () => {
  const ref = useRef();
  const isVisible = Utilities.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("Social");
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="section">
      <Row justify="center">
        <Col xs={24} md={12} lg={8}>
          <a
            className="twitter-timeline"
            data-height="600"
            data-theme="light"
            // data-tweet-limit="4"
            href="https://twitter.com/rocketalertlive"
          >
            Tweets by rocketalertlive
          </a>{" "}
        </Col>
      </Row>
    </section>
  );
};

Social.propTypes = {};

Social.defaultProps = {};

export default Social;
