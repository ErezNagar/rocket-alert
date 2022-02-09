// import PropTypes from "prop-types";

const FAQ = () => (
  <section className="section faq">
    <h2>Frequently Asked Questions</h2>
    <div>
      <p className="question-title">Where are these rockets launched from?</p>
      <p className="question-answer">
        Mostly from the{" "}
        <a href="https://en.wikipedia.org/wiki/Gaza_Strip">Gaza Strip</a>,
        although sometimes there are rockets launched from South Lebanon or
        Syria.
      </p>
    </div>
    <div>
      <p className="question-title">Who is shooting these rockets?</p>
      <p className="question-answer">
        Palestinian factions from Gaza, namely{" "}
        <a hreg="https://www.dni.gov/nctc/groups/hamas.html">Hamas</a> and
        Islamic Jihad terror organizations, as well as{" "}
        <a href="https://www.dni.gov/nctc/groups/hizballah.html">Hezbollah</a>{" "}
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
        <a href="https://en.wikipedia.org/wiki/Iron_Dome">
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
  </section>
);

FAQ.propTypes = {};

FAQ.defaultProps = {};

export default FAQ;
