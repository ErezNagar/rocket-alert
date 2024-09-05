// import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import Util from "../util";
import Tracking from "../tracking";
import { Row, Col } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";

const FAQ = () => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);
  const [toggles, setToggles] = useState(new Set());

  const handleOnClick = (idx) => {
    const newToggles = new Set(toggles);
    newToggles.has(idx) ? newToggles.delete(idx) : newToggles.add(idx);
    setToggles(newToggles);
  };

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("FAQ");
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="section faq" id="faq">
      <h2>Frequently Asked Questions</h2>
      <Row justify="center">
        <Col md={24} lg={18}>
          <Row className="question">
            <Col span={24}>
              <p className="question-title" onClick={() => handleOnClick(1)}>
                <span>
                  {toggles.has(1) ? <MinusOutlined /> : <PlusOutlined />}
                </span>
                Where are these rockets and UAV's fired from?
              </p>
              {toggles.has(1) && (
                <p className="question-answer">
                  Before the Hamas attack on October 7, 2023, rockets were
                  mostly fired from the{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Gaza_Strip"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Gaza Strip
                  </a>
                  , but since then, rockets and also UAV's (i.e. loitering
                  munition, more commonly known as{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Loitering_munition"
                    target="_blank"
                    rel="noreferrer"
                  >
                    exploding drones
                  </a>
                  ) have been fired mostly from South Lebanon, but also from
                  Syria, Iraq and Yemen.
                </p>
              )}
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(2)}>
                  <span>
                    {toggles.has(2) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  Who is firing these rockets and UAV's?
                </p>
                {toggles.has(2) && (
                  <p className="question-answer">
                    Palestinian terror organizations from Gaza, namely{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Hamas"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Hamas
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Palestinian_Islamic_Jihad"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Islamic Jihad
                    </a>
                    , as well as{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Hezbollah"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Hezbollah
                    </a>{" "}
                    terror organization based in South Lebanon.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(3)}>
                  <span>
                    {toggles.has(3) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  What are these rockets and UAVs targeting?
                </p>
                {toggles.has(3) && (
                  <p className="question-answer">
                    Whether fired from Gaza or South Lebanon, these rockets and
                    UAVs are fired indiscriminately at Israeli towns and cities,
                    deliberatly targeting innocent civilians, homes and schools.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(4)}>
                  <span>
                    {toggles.has(4) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  Does Israel respond?
                </p>
                {toggles.has(4) && (
                  <p className="question-answer">
                    In addition to protecting its civilians via a combination of
                    bomb shelters and the deployment of the Iron Dome system,
                    Israel typically responds by air striking terror targets,
                    including launch sites, command and control centers, and
                    weapons storage sites.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(5)}>
                  <span>
                    {toggles.has(5) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  What is Iron Dome?
                </p>
                {toggles.has(5) && (
                  <p className="question-answer">
                    The{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Iron_Dome"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Iron Dome Aerial Defense System
                    </a>{" "}
                    is an Israeli air defense system desgined to intercept and
                    destroy rockets whos trjectory would take them to an Israeli
                    populated area.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(6)}>
                  <span>
                    {toggles.has(6) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  Do rockets ever hit Israel?
                </p>
                {toggles.has(6) && (
                  <p className="question-answer">
                    Yes. While Iron Dome intercepts most of the rockets fired at
                    Israeli population, rockets still penetrate the defense
                    system and hit residential areas, including homes and
                    schools.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(7)}>
                  <span>
                    {toggles.has(7) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  Where does the alert data come from?
                </p>
                {toggles.has(7) && (
                  <p className="question-answer">
                    We use the IDF's{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Home_Front_Command"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Home Front Command
                    </a>{" "}
                    (Pikud HaOref) rocket alert API, which allows us to easily
                    query for real-time rocket alerts. We aggregate the data and
                    slice & dice the information to provide historical data and
                    other insights.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(8)}>
                  <span>
                    {toggles.has(8) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  How reliable is your data?
                </p>
                {toggles.has(8) && (
                  <p className="question-answer">
                    The real-time rocket alerts we show are queried directly
                    from the Home Front Command's API, which is connected to the
                    IDF's{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Red_Color"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Red Color
                    </a>{" "}
                    early-warning system. The Red Color system is Israel's
                    official source for rocket alerts which millions of Israelis
                    rely on for their safety. A real-time alert would show up on
                    the website immediately after there's an alert going off in
                    Israel. In some cases, and depending on your connection, it
                    might take a few seconds for an alert going off in Israel to
                    show up.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(9)}>
                  <span>
                    {toggles.has(9) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  Does one alert represent a single rocket?
                </p>
                {toggles.has(9) && (
                  <p className="question-answer">
                    We only have data on the number of alerts, not on the number
                    of rockets being fired. A single rocket could trigger an
                    alert in multiple locations, depending on the proximity of
                    those locations to each other and the geographical size of
                    those communities. An alert in a specified location
                    typically indicates at least one rocket fired towards that
                    location.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(10)}>
                  <span>
                    {toggles.has(10) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  How can I learn more and stay updated?
                </p>
                {toggles.has(10) && (
                  <p className="question-answer">
                    Follow us on{" "}
                    <a
                      href="https://twitter.com/rocketalertlive"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Twitter (X)
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://www.instagram.com/RocketAlertLive/"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Instagram
                    </a>{" "}
                    . Join our live alert feeds on{" "}
                    <a
                      href="https://t.me/RocketAlert"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Telegram
                    </a>{" "}
                    and{" "}
                    <a
                      href="https://mastodon.social/@rocketalert"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Mastodon
                    </a>{" "}
                    for real-time alerts.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(11)}>
                  <span>
                    {toggles.has(11) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  How can I support this project?
                </p>
                {toggles.has(11) && (
                  <p className="question-answer">
                    Consider supporting us by{" "}
                    <a
                      href="https://www.buymeacoffee.com/RocketAlertLive"
                      target="_blank"
                      rel="noreferrer"
                    >
                      buying us coffee!
                    </a>{" "}
                    Your contribution helps cover the costs of maintaining the
                    site.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(12)}>
                  <span>
                    {toggles.has(12) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  Could I get access to your data?
                </p>
                {toggles.has(12) && (
                  <p className="question-answer">
                    We'd love to help! Feel free to{" "}
                    <a href={"mailto: rocketalertlive@gmail.com"}>contact us</a>{" "}
                    with more information on your speific use case.
                  </p>
                )}
              </div>
            </Col>
          </Row>
        </Col>
      </Row>
    </section>
  );
};

FAQ.propTypes = {};

FAQ.defaultProps = {};

export default FAQ;
