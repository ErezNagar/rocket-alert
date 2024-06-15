import PropTypes from "prop-types";
import { ReactComponent as TwitterLogo } from "../assets/twitter_black.svg";
import Tracking from "../tracking";
import { useEffect, useRef, useState } from "react";
import Util from "../util";
import { withTranslation } from "react-i18next";

const TimeToShelter = ({ t, alerts }) => {
  const [showTimeToShelter, setShowTimeToShelter] = useState(false);
  const [timeToShelterTitle, setTimeToShelterTitle] = useState("");
  const [timeToShelterText, setTimeToShelterText] = useState("");
  const [timeToShelterShareTitle, setTimeToShelterShareTitle] = useState("");
  const [timeToShelterShareText, setTimeToShelterShareText] = useState("");

  const ref = useRef();
  const isVisible = Util.useIsVisible(ref);

  const KMToMiles = (km) => Math.round(km * 0.621371 * 10) / 10;

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("TimeToShelter");
    }
  }, [isVisible]);

  useEffect(() => {
    const alertsWithCountdown = alerts?.filter(
      (alert) => alert.countdownSec === 0 || alert.countdownSec > 0
    );
    if (alertsWithCountdown.length === 0) {
      return;
    }
    const alert = alertsWithCountdown[0];

    const alertDistance = Util.getDistanceByTimeToShelter(alert.countdownSec);
    const alertDistanceInKM = KMToMiles(alertDistance);
    const title =
      alertDistance > 5
        ? t("time_to_shelter.title_far", { countdownSec: alert.countdownSec })
        : t("time_to_shelter.title_near");

    const text =
      alertDistance > 5
        ? t("time_to_shelter.text_far", { distanceKM: alertDistance, distanceMiles: alertDistanceInKM })
        : t("time_to_shelter.text_near", { distanceMiles: alertDistanceInKM });

    const timeToShelterShareTitle =
      alertDistance > 5
        ? t("time_to_shelter.share_title_far", { countdownSec: alert.countdownSec })
        : t("time_to_shelter.share_title_near");

    const timeToShelterShareText =
      alertDistance > 5
        ? t("time_to_shelter.share_text_far", { distanceKM: alertDistance, distanceMiles: alertDistanceInKM })
        : t("time_to_shelter.share_text_near", { distanceMiles: alertDistanceInKM });

    setTimeToShelterTitle(title);
    setTimeToShelterText(text);
    setTimeToShelterShareTitle(timeToShelterShareTitle);
    setTimeToShelterShareText(timeToShelterShareText);
    setShowTimeToShelter(true);
  }, [alerts, t]);

  return showTimeToShelter ? (
    <div ref={ref} className="time-to-shelter">
      <h2>{timeToShelterTitle}</h2>
      <h3>{timeToShelterText}</h3>
      <div>
        <a
          href={`https://twitter.com/share?text=${timeToShelterShareTitle} ${timeToShelterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
          target="_blank"
          rel="noreferrer"
          style={{ color: "black" }}
          onClick={Tracking.shareTimetoShelterClick}
        >
          <TwitterLogo style={{ height: "36px" }} />
        </a>
        <div>
          <a
            style={{ color: "black" }}
            href={`https://twitter.com/share?text=${timeToShelterShareTitle} ${timeToShelterShareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
            target="_blank"
            rel="noreferrer"
            onClick={Tracking.shareTimetoShelterClick}
          >
            {t("Share this")}
          </a>
        </div>
      </div>
      <p>{t("time_to_shelter.based_on_last_alert")}</p>
    </div>
  ) : null;
};

TimeToShelter.propTypes = {
  alerts: PropTypes.array.isRequired,
};

export default withTranslation()(TimeToShelter);
