import React from "react";
import PropTypes from "prop-types";
import FadeInOut from "./FadeInOut";
import FormattedAlertTime from "./FormattedAlertTime";
import { ReactComponent as TwitterLogo } from "../assets/twitter.svg";
import { ReactComponent as LanguageIcon } from "../assets/language.svg"; // Assuming you have a language icon SVG
import logo from "../assets/logo.svg";
import Tracking from "../tracking";
import Util from "../util";
import { withTranslation } from 'react-i18next';
import 'flag-icons/css/flag-icons.min.css';

class StickyHeader extends React.Component {
  state = {
    shouldRefresh: false,
  };

  componentDidUpdate(prevProps) {
    if (this.props.realTimeAlert !== prevProps.realTimeAlert) {
      this.refreshAlert(this.props.realTimeAlert);
    }
  }

  refreshAlert = () => {
    this.setState({
      shouldRefresh: true,
    });
    setTimeout(() => {
      this.setState({ shouldRefresh: false });
    }, Util.REAL_TIME_ALERT_DISPLAY_DURATION);
  };

  setStickyHeaderStyle = () => {
    let cssClass = "sticky-header";
    if (this.props.showStickyHeader) {
      cssClass += " active";
    }
    if (this.props.isAlertMode) {
      cssClass += " alert-mode";
    }
    return cssClass;
  };

  render() {
    const { isAlertMode, realTimeAlert, i18n } = this.props;

    const changeLanguage = (lng) => {
      i18n.changeLanguage(lng);
    };

    return (
      <header className={this.setStickyHeaderStyle()}>
        <div className="left-container">
          <img className="logo" src={logo} alt="" />
        </div>
        <div className="alerts">
          {isAlertMode && realTimeAlert && (
            <FadeInOut show={this.state.shouldRefresh}>
              <FormattedAlertTime timeStamp={realTimeAlert.timeStamp} />{" "}
              {realTimeAlert.englishName || realTimeAlert.name}
            </FadeInOut>
          )}
        </div>
        <div className="right-container">
          <a
            href={`https://twitter.com/share?text=${this.props.twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
            target="_blank"
            rel="noreferrer"
            onClick={Tracking.shareStickyHeaderClick}
            style={{ marginRight: '10px' }} // Ensure some spacing between buttons
          >
            <TwitterLogo style={{ height: "36px" }} />
          </a>
          <div className="language-dropdown">
            <button className="dropbtn">
              <LanguageIcon style={{ height: "24px" }} />
            </button>
            <div className="dropdown-content">
              <button onClick={() => changeLanguage('en')}>
                <span className="fi fi-gb"></span> English
              </button>
              <button onClick={() => changeLanguage('de')}>
                <span className="fi fi-de"></span> Deutsch
              </button>
              <button onClick={() => changeLanguage('tr')}>
                <span className="fi fi-tr"></span> Türkisch
              </button>
              <button onClick={() => changeLanguage('fr')}>
                <span className="fi fi-fr"></span> French
              </button>
              <button onClick={() => changeLanguage('ru')}>
                <span className="fi fi-ru"></span> Russisch
              </button>
              <button onClick={() => changeLanguage('ua')}>
                <span className="fi fi-ua"></span> Ukrainisch
              </button>
              <button onClick={() => changeLanguage('he')}>
                <span className="fi fi-il"></span> Hebrew
              </button>
              <button onClick={() => changeLanguage('in')}>
                <span className="fi fi-in"></span> Indisch
              </button>
              <button onClick={() => changeLanguage('za')}>
                <span className="fi fi-za"></span> Afrikaans
              </button>
            </div>
          </div>
        </div>
      </header>
    );
  }
}

StickyHeader.propTypes = {
  showStickyHeader: PropTypes.bool,
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.object,
  // Text to share on twitter. Generated in Header
  twitterShareText: PropTypes.string,
  t: PropTypes.func.isRequired,
  i18n: PropTypes.object.isRequired,
};

StickyHeader.defaultProps = {
  showStickyHeader: false,
  isAlertMode: false,
  realTimeAlert: {},
  twitterShareText: "",
};

export default withTranslation()(StickyHeader);
