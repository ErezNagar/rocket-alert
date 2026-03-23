import PropTypes from "prop-types";
import { ReactComponent as TwitterLogo } from "../assets/twitter_black.svg";
import Tracking from "../tracking";
import { useEffect, useRef, useState } from "react";
import Utilities from "../utilities/utilities";

const TimeToShelter = ({ alerts, onToggleMapFocus }) => {
  const [alert, setAlert] = useState(null);
  const [shouldShowTimeToShelter, setShouldShowTimeToShelter] = useState(false);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [shareTitle, setShareTitle] = useState("");
  const [shareText, setShareText] = useState("");

  const ref = useRef();
  const isVisible = Utilities.useIsVisible(ref);

  const KMToMiles = (km) => Math.round(km * 0.621371 * 10) / 10;

  useEffect(() => {
    if (isVisible) {
      Tracking.visibleEvent("TimeToShelter");
    }
  }, [isVisible]);

  useEffect(() => {
    /*
        Get the first alert that with countdown data.
        Since Lion's Roar (Feb 28, 2026), this focuses on alerts near the border with Lebanon or Gaza,
        Since alerts in other locations are most likly due to missiles from Iran.
    */
    // const alert = alerts?.find((alert) => alert.countdownSec >= 0);
    const alert = alerts?.find(
      (alert) =>
        alert.countdownSec >= 0 &&
        (alert.areaNameEn === "Confrontation Line" ||
          alert.areaNameEn === "Gaza Envelope"),
    );
    if (!alert) {
      return;
    }
    const distance = Utilities.getDistanceByTimeToShelter(alert.countdownSec);
    const distanceInMiles = KMToMiles(distance);
    const title =
      distance > 5
        ? `You have ${alert.countdownSec} seconds to get to shelter!`
        : `Get to shelter immediately!`;

    const text = `, a rocket targeting you was fired just ${distance} km (${distanceInMiles} miles) away.`;

    const shareTitle =
      distance > 5
        ? `I'd have ${alert.countdownSec} seconds to get to shelter!`
        : `I'd have to get to shelter immediately!`;

    const shareText =
      distance > 5
        ? `If I lived in ${alert.englishName || alert.name}, a rocket targeting me was fired just ${distance} km (${distanceInMiles} miles) away.`
        : `If I lived in ${alert.englishName || alert.name}, a rocket targeting me was fired just less than 5 km (${distanceInMiles} miles) away.`;

    setAlert(alert);
    setTitle(title);
    setText(text);
    setShareTitle(shareTitle);
    setShareText(shareText);
    setShouldShowTimeToShelter(true);
  }, [alerts]);

  const handleLocationClick = () => {
    Tracking.timeToShelterLocationClick();
    onToggleMapFocus(alert);
  };

  return (
    shouldShowTimeToShelter && (
      <div ref={ref} className="time-to-shelter">
        <h2>{title}</h2>
        <h3>
          If you lived in{" "}
          {alert.lat && alert.lon ? (
            <span onClick={handleLocationClick} className="location">
              {alert.englishName || alert.name}
            </span>
          ) : (
            alert.englishName || alert.name
          )}
          {text}
        </h3>
        <div>
          <a
            href={`https://twitter.com/share?text=${shareTitle} ${shareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
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
              href={`https://twitter.com/share?text=${shareTitle} ${shareText}&url=RocketAlert.live&hashtags=RocketAlert,IsraelUnderAttack`}
              target="_blank"
              rel="noreferrer"
              onClick={Tracking.shareTimetoShelterClick}
            >
              Share this
            </a>
          </div>
        </div>
        <p>Based on recent alerts in that area</p>
      </div>
    )
  );
};

TimeToShelter.propTypes = {
  alerts: PropTypes.array.isRequired,
  onToggleMapFocus: PropTypes.func,
};

export default TimeToShelter;
