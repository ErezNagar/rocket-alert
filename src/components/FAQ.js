import PropTypes from "prop-types";
import { useState } from "react";
import Tracking from "../tracking";
import { Row, Col } from "antd";
import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import withIsVisibleHook from "./withIsVisibleHook";

const FAQ = ({ isIntersectingRef }) => {
  const [toggles, setToggles] = useState(new Set());

  const handleOnClick = (idx) => {
    Tracking.FAQClick(idx);
    const newToggles = new Set(toggles);
    newToggles.has(idx) ? newToggles.delete(idx) : newToggles.add(idx);
    setToggles(newToggles);
  };

  return (
    <section ref={isIntersectingRef} className="section faq" id="faq">
      <h2>Frequently Asked Questions</h2>
      <Row justify="center">
        <Col md={24} lg={12}>
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
                  primarily fired from the{" "}
                  <a
                    href="https://en.wikipedia.org/wiki/Gaza_Strip"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Gaza Strip
                  </a>
                  . Since then, attacks have expanded significantly and now
                  include launches from South Lebanon, Syria, Iraq, Yemen, and,
                  in some cases, direct missile launches from Iran. These
                  attacks include rockets, UAVs (
                  <a
                    href="https://en.wikipedia.org/wiki/Loitering_munition"
                    target="_blank"
                    rel="noreferrer"
                  >
                    loitering munitions
                  </a>
                  ), and longer-range ballistic missiles.
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
                    Attacked are carried out by multiple Iranian-backed groups,
                    including Palestinian terror organizations{" "}
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
                    </a>{" "}
                    in Gaza, and{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Hezbollah"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Hezbollah
                    </a>{" "}
                    terror organization in Lebanon. Additional attacks have
                    originated from militias in Syria, Iraq, and Yemen. Iran has
                    also been directly involved in launching missiles and UAVs
                    toward Israel
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
                    These rockets and UAVs are fired indiscriminately at Israeli
                    population centers, deliberatly targeting civilians, public
                    infrastructure and residential areas such as homes and
                    schools.
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
                    Israel employs multiple defensive systems to protect
                    civilians, including bomb shelters and advanced missile
                    defense systems such as Iron Dome, David's Sling, and Arrow.
                    In response to attacks, Israel typically conducts military
                    operations targeting launch sites, weapons storage
                    facilities, and command centers used by the groups
                    responsible.
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
                    <a
                      href="https://en.wikipedia.org/wiki/Iron_Dome"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Iron Dome
                    </a>{" "}
                    is an Israeli short-range air defense system designed to
                    intercept rockets heading toward populated areas. It is part
                    of a broader, multi-layered defense system that also
                    includes{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/David%27s_Sling"
                      target="_blank"
                      rel="noreferrer"
                    >
                      David’s Sling
                    </a>{" "}
                    (for medium-range threats) and{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Arrow_3"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Arrow
                    </a>{" "}
                    (for long-range ballistic missiles).
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
                    Yes. While Israel’s missile defense systems intercept many
                    incoming threats, some rockets and missiles, including
                    larger or more advanced projectiles, can penetrate defenses
                    and impact populated areas.
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
                    We use the IDF{" "}
                    <a
                      href="https://en.wikipedia.org/wiki/Home_Front_Command"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Home Front Command
                    </a>{" "}
                    (Pikud HaOref) alert API to retrieve real-time rocket and
                    missile alerts. We aggregate and process this data to
                    provide historical records and insights.
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
                    The real-time alerts displayed on this site are sourced
                    directly from the Home Front Command system, which powers
                    Israel's official "
                    <a
                      href="https://en.wikipedia.org/wiki/Red_Color"
                      target="_blank"
                      rel="noreferrer"
                    >
                      Code Red
                    </a>
                    " early-warning network used by millions of civilians.
                    Alerts typically appear on our platform within seconds,
                    though minor delays may occur depending on network
                    conditions.
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
                    Not necessarily. We track alerts, not individual
                    projectiles. A single rocket, missile, or UAV may trigger
                    alerts across multiple locations. Conversely, multiple
                    projectiles may trigger a single alert in a given area.
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
                  What types of threats are included in your alerts?
                </p>
                {toggles.has(10) && (
                  <p className="question-answer">
                    Alerts may be triggered by various threats, including
                    short-range rockets, long-range missiles (including
                    ballistic missiles), and UAVs (drones or loitering
                    munitions). The system does not always distinguish between
                    threat types in publicly available data.
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
                  What is the difference between rockets, missiles, and UAVs?
                </p>
                {toggles.has(11) && (
                  <p className="question-answer">
                    Rockets are typically unguided and shorter-range. Missiles
                    (including ballistic missiles) are often guided and can
                    travel much longer distances. UAVs, or unmanned aerial
                    vehicles (drones), are remotely operated or autonomous
                    aircrafts that can carry explosives.
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
                  Why do some areas receive alerts while others do not?
                </p>
                {toggles.has(12) && (
                  <p className="question-answer">
                    Alerts are issued based on projected threat trajectories.
                    Only areas at risk of impact receive alerts, which is why
                    nearby locations may not always be notified.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(13)}>
                  <span>
                    {toggles.has(13) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  How much time do people have to take shelter?
                </p>
                {toggles.has(13) && (
                  <p className="question-answer">
                    The time varies depending on location and distance from the
                    launch site. In some areas, civilians may have under 15
                    seconds, while in others they may have just over a minute.
                  </p>
                )}
              </div>
            </Col>
          </Row>
          <Row className="question">
            <Col span={24}>
              <div>
                <p className="question-title" onClick={() => handleOnClick(14)}>
                  <span>
                    {toggles.has(14) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  How can I learn more and stay updated?
                </p>
                {toggles.has(14) && (
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
                    . Subscribe to our live alert feeds on{" "}
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
                <p className="question-title" onClick={() => handleOnClick(15)}>
                  <span>
                    {toggles.has(15) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  How can I support this project?
                </p>
                {toggles.has(15) && (
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
                <p className="question-title" onClick={() => handleOnClick(16)}>
                  <span>
                    {toggles.has(16) ? <MinusOutlined /> : <PlusOutlined />}
                  </span>
                  Could I get access to your data?
                </p>
                {toggles.has(16) && (
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

FAQ.propTypes = {
  // For Tracking
  isIntersectingRef: PropTypes.object.isRequired,
};

export default withIsVisibleHook(FAQ, "FAQ");
