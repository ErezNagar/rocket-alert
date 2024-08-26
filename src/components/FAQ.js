// import PropTypes from "prop-types";
import { useEffect, useRef } from "react";
import Util from "../util";
import Tracking from "../tracking";

const FAQ = () => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("FAQ");
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="section faq" id="faq">
      <h2>Frequently Asked Questions</h2>
      <div>
        <p className="question-title">
          Where are these rockets and UAV's fired from?
        </p>
        <p className="question-answer">
          Before the Hamas attack on October 7, 2023, rockets were mostly fired
          from the{" "}
          <a
            href="https://en.wikipedia.org/wiki/Gaza_Strip"
            target="_blank"
            rel="noreferrer"
          >
            Gaza Strip
          </a>
          , but since then, rockets and also UAV's (i.e. loitering munition,
          more commonly known as{" "}
          <a
            href="https://en.wikipedia.org/wiki/Loitering_munition"
            target="_blank"
            rel="noreferrer"
          >
            exploding drones
          </a>
          ) have been fired mostly from South Lebanon, but also from Syria, Iraq
          and Yemen.
        </p>
      </div>
      <div>
        <p className="question-title">Who is firing these rockets and UAV's?</p>
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
      </div>
      <div>
        <p className="question-title">
          What are these rockets and UAVs targeting?
        </p>
        <p className="question-answer">
          Whether fired from Gaza or South Lebanon, these rockets and UAVs are
          fired indiscriminately at Israeli towns and cities, deliberatly
          targeting innocent civilians, homes and schools.
        </p>
      </div>
      <div>
        <p className="question-title">Does Israel respond?</p>
        <p className="question-answer">
          In addition to protecting its civilians via a combination of bomb
          shelters and the deployment of the Iron Dome system, Israel typically
          responds by air striking terror targets, including launch sites,
          command and control centers, and weapons storage sites.
        </p>
      </div>
      <div>
        <p className="question-title">What is Iron Dome?</p>
        <p className="question-answer">
          The{" "}
          <a
            href="https://en.wikipedia.org/wiki/Iron_Dome"
            target="_blank"
            rel="noreferrer"
          >
            Iron Dome Aerial Defense System
          </a>{" "}
          is an Israeli air defense system desgined to intercept and destroy
          rockets whos trjectory would take them to an Israeli populated area.
        </p>
      </div>
      <div>
        <p className="question-title">Do rockets ever hit Israel?</p>
        <p className="question-answer">
          Yes. While Iron Dome intercepts most of the rockets fired at Israeli
          population, rockets still penetrate the defense system and hit
          residential areas, including homes and schools.
        </p>
      </div>
      <div>
        <p className="question-title">Where does the alert data come from?</p>
        <p className="question-answer">
          We use the IDF's{" "}
          <a
            href="https://en.wikipedia.org/wiki/Home_Front_Command"
            target="_blank"
            rel="noreferrer"
          >
            Home Front Command
          </a>{" "}
          (Pikud HaOref) rocket alert API, which allows us to easily query for
          real-time rocket alerts. We aggregate the data and slice & dice the
          information to provide historical data and other insights.
        </p>
      </div>
      <div>
        <p className="question-title">How reliable is your data?</p>
        <p className="question-answer">
          The real-time rocket alerts we show are queried directly from the Home
          Front Command's API, which is connected to the IDF's{" "}
          <a
            href="https://en.wikipedia.org/wiki/Red_Color"
            target="_blank"
            rel="noreferrer"
          >
            Red Color
          </a>{" "}
          early-warning system. The Red Color system is Israel's official source
          for rocket alerts which millions of Israelis rely on for their safety.
          A real-time alert would show up on the website immediately after
          there's an alert going off in Israel. In some cases, and depending on
          your connection, it might take a few seconds for an alert going off in
          Israel to show up.
        </p>
      </div>
      <div>
        <p className="question-title">
          Does one alert represent a single rocket?
        </p>
        <p className="question-answer">
          We only have data on the number of alerts, not on the number of
          rockets being fired. A single rocket could trigger an alert in
          multiple locations, depending on the proximity of those locations to
          each other and the geographical size of those communities. An alert in
          a specified location typically indicates at least one rocket fired
          towards that location.
        </p>
      </div>
      <div>
        <p className="question-title">How can I learn more and stay updated?</p>
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
          <a href="https://t.me/RocketAlert" target="_blank" rel="noreferrer">
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
      </div>
      <div>
        <p className="question-title">How can I support this project?</p>
        <p className="question-answer">
          Consider supporting us by{" "}
          <a
            href="https://www.buymeacoffee.com/RocketAlertLive"
            target="_blank"
            rel="noreferrer"
          >
            buying us coffee!
          </a>{" "}
          Your contribution helps cover the costs of maintaining the site.
        </p>
      </div>
      <div>
        <p className="question-title">Could I get access to your data?</p>
        <p className="question-answer">
          We'd love to help! Feel free to{" "}
          <a href={"mailto: rocketalertlive@gmail.com"}>contact us</a> with more
          information on your speific use case.
        </p>
      </div>
    </section>
  );
};

FAQ.propTypes = {};

FAQ.defaultProps = {};

export default FAQ;
