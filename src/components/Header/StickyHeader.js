import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import FadeInOut from "../FadeInOut";
import FormattedAlertTime from "../FormattedAlertTime";
import { ReactComponent as TwitterLogo } from "../../assets/twitter.svg";
import logo from "../../assets/logo.svg";
import Tracking from "../../tracking";
import Util from "../../util";

const StickyHeader = ({
  showStickyHeader,
  isAlertMode,
  realTimeAlert,
  twitterShareText,
}) => {
  const [shouldRefresh, setShouldRefresh] = useState(false);

  useEffect(() => {
    refreshAlert(realTimeAlert);
  }, [realTimeAlert]);

  const refreshAlert = () => {
    setShouldRefresh(true);
    setTimeout(() => {
      setShouldRefresh(false);
    }, Util.REAL_TIME_ALERT_DISPLAY_DURATION);
  };

  const setStickyHeaderStyle = () => {
    let cssClass = "sticky-header";
    if (showStickyHeader) {
      cssClass += " active";
    }
    if (isAlertMode) {
      cssClass += " alert-mode";
    }
    return cssClass;
  };

  return (
    <header className={setStickyHeaderStyle()}>
      <div className="left-container">
        <img className="logo" src={logo} alt="" />
      </div>
      <div className="alerts">
        {isAlertMode && realTimeAlert && (
          <FadeInOut show={shouldRefresh}>
            {!Util.isSmallViewport() && (
              <>
                <FormattedAlertTime timeStamp={realTimeAlert.timeStamp} />
                {` ${Util.getAlertTypeText(realTimeAlert)}: `}
              </>
            )}
            {realTimeAlert.englishName || realTimeAlert.name}
          </FadeInOut>
        )}
      </div>
      {twitterShareText && (
        <div className="right-container">
          <a
            href={`https://twitter.com/share?text=${twitterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
            target="_blank"
            rel="noreferrer"
            onClick={Tracking.shareStickyHeaderClick}
          >
            <TwitterLogo style={{ height: "36px" }} />
          </a>
        </div>
      )}
    </header>
  );
};

StickyHeader.propTypes = {
  showStickyHeader: PropTypes.bool,
  isAlertMode: PropTypes.bool,
  realTimeAlert: PropTypes.object,
  // Text to share on twitter. Generated in Header
  twitterShareText: PropTypes.string,
};

StickyHeader.defaultProps = {
  showStickyHeader: false,
  isAlertMode: false,
  realTimeAlert: {},
  twitterShareText: "",
};

export default StickyHeader;
