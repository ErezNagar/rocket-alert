// import PropTypes from "prop-types";

const FAQ = () => (
  <section className="section faq">
    <h2>Frequently Asked Questions</h2>
    <div>
      <p className="question-title">Where are these rockets launched from?</p>
      <p className="question-answer">
        Mostly from the{" "}
        <a
          href="https://en.wikipedia.org/wiki/Gaza_Strip"
          target="_blank"
          rel="noreferrer"
        >
          Gaza Strip
        </a>
        , although sometimes there are rockets launched from South Lebanon or
        Syria.
      </p>
    </div>
    <div>
      <p className="question-title">Who is shooting these rockets?</p>
      <p className="question-answer">
        Palestinian factions from Gaza, namely{" "}
        <a
          href="https://en.wikipedia.org/wiki/Hamas"
          target="_blank"
          rel="noreferrer"
        >
          Hamas
        </a>{" "}
        and Islamic Jihad terror organizations, as well as{" "}
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
      <p className="question-title">What are these rockets targeting?</p>
      <p className="question-answer">
        Whether launched from Gaza or South Lebanon, these rockets are launched
        indiscriminately at Israeli towns and cities, deliberatly targeting
        innocent civilians.
      </p>
    </div>
    <div>
      <p className="question-title">Does Israel respond?</p>
      <p className="question-answer">
        In addition to protecting its civilians via a combination of bomb
        shelters and the deployment of the Iron Dome system, Israel typically
        responds by air striking terror targets, including launch sites, command
        and control centers, and weapons storage sites.
      </p>
    </div>
    <div>
      <p className="question-title">What is Iron Dome</p>
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
        Yes. While Iron Dome intercepts about 90% of rockets aimed at Israeli
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
        (Pikud HaOref) unofficial rocket alert API, which allows you to easily
        query for active rocket alerts. We aggregate and analyze the information
        to show historical data
      </p>
    </div>
    <div>
      <p className="question-title">How reliable is the data?</p>
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
        early-warning system. In most cases, it would take just a few seconds
        for a real-time alert going off in Israel to show up.
      </p>
    </div>
  </section>
);

FAQ.propTypes = {};

FAQ.defaultProps = {};

export default FAQ;
