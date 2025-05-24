import PropTypes from "prop-types";
import { ReactComponent as TwitterLogo } from "../assets/twitter_black.svg";
import Tracking from "../tracking";
import { useEffect, useRef, useState } from "react";
import Utilities from "../utilities/utilities";

const TimeToShelter = ({ alerts }) => {
  const [showTimeToShelter, setShowTimeToShelter] = useState(false);
  const [timeToShelterTitle, setTimeToShelterTitle] = useState("");
  const [timeToShelterText, setTimeToShelterText] = useState("");
  const [timeToShelterShareTitle, setTimeToShelterShareTitle] = useState("");
  const [timeToShelterShareText, setTimeToShelterShareText] = useState("");

  const ref = useRef();
  const isVisible = Utilities.useIsVisible();

  const KMToMiles = (km) => Math.round(km * 0.621371 * 10) / 10;

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("TimeToShelter");
    }
  }, [isVisible]);

  useEffect(() => {
    // Filters alerts with countdown data and use the first one
    const alertsWithCountdown = alerts?.filter(
      (alert) => alert.countdownSec === 0 || alert.countdownSec > 0
    );
    if (alertsWithCountdown.length === 0) {
      return;
    }
    const alert = alertsWithCountdown[0];

    const alertDistance = Utilities.getDistanceByTimeToShelter(
      alert.countdownSec
    );
    const alertDistanceInKM = KMToMiles(alertDistance);
    const title =
      alertDistance > 5
        ? `You have ${alert.countdownSec} seconds to get to shelter!`
        : `Get to shelter immediately!`;

    const text =
      alertDistance > 5
        ? `If this was happening in your area, this means a rocket targeting you was fired roughly ${alertDistance} km (${alertDistanceInKM} miles) away`
        : `If this was happening in your area, this means a rocket targeting you was fired less than 5 km (${alertDistanceInKM} miles) away`;

    const timeToShelterShareTitle =
      alertDistance > 5
        ? `I'd have ${alert.countdownSec} seconds to get to shelter!`
        : `I'd have to get to shelter immediately!`;

    const timeToShelterShareText =
      alertDistance > 5
        ? `If this was happening in MY area, this means a rocket targeting me would've been fired roughly ${alertDistance} km (${alertDistanceInKM} miles) away`
        : `If this was happening in MY area, this means a rocket targeting me would've been fired less than 5 km (${alertDistanceInKM} miles) away`;

    setTimeToShelterTitle(title);
    setTimeToShelterText(text);
    setTimeToShelterShareTitle(timeToShelterShareTitle);
    setTimeToShelterShareText(timeToShelterShareText);
    setShowTimeToShelter(true);
  }, [alerts]);

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
            Share this
          </a>
        </div>
      </div>
      <p>Based on the last rocket alert</p>
    </div>
  ) : null;
};

TimeToShelter.propTypes = {
  alerts: PropTypes.array.isRequired,
};

export default TimeToShelter;
