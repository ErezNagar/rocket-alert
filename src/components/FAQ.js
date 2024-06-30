import React, { useEffect, useRef } from "react";
import Util from "../util";
import Tracking from "../tracking";
import { withTranslation } from "react-i18next";

const FAQ = ({ t }) => {
  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("FAQ");
    }
  }, [isVisible]);

  return (
    <section ref={ref} className="section faq" id="faq">
      <h2>{t("faq_title")}</h2>
      <div>
        <p className="question-title">{t("faq_questions.q1")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a1")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q2")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a2")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q3")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a3")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q4")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a4")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q5")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a5")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q6")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a6")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q7")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a7")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q8")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a8")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q9")}</p>
        <p className="question-answer" dangerouslySetInnerHTML={{__html: t("faq_questions.a9")}}></p>
      </div>
      <div>
        <p className="question-title">{t("faq_questions.q10")}</p>
        <p className="question-answer">
          {t("faq_questions.a10")} <a href="mailto:rocketalertlive@gmail.com">{t("faq_questions.a10_link")}</a>
        </p>
      </div>
    </section>
  );
};

FAQ.propTypes = {};

FAQ.defaultProps = {};

export default withTranslation()(FAQ);
