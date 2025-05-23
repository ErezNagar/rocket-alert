import queryString from "query-string";
import { useEffect, useState } from "react";
import {
  isIranianMissileAttackTimeFrame,
  isYemenMissileAttackTimeFrame,
  isConfirmedFalseAlert,
} from "./date_helper";

/*
 * The duration in milliseconds of the css transition for real-time alert
 */
const REAL_TIME_ALERT_TRANSITION_DURATION = 400;

/*
 * The interval in milliseconds in which real-time alerts are read from the alert queue
 * Set to display time + total transition time;
 */
const REAL_TIME_ALERT_THROTTLE_DURATION = 3500;

/*
 * The net duration in milliseconds a real-time alert is shown, not including css transition time
 */
const REAL_TIME_ALERT_DISPLAY_DURATION =
  REAL_TIME_ALERT_THROTTLE_DURATION - REAL_TIME_ALERT_TRANSITION_DURATION * 2;

/*
 * The max amount of alerts to show in in Most Recent Alerts section
 */
const MAX_RECENT_ALERTS = 100;

/*
 * Alert Type Ids
 */
const ALERT_TYPE_ALL = -1;
const ALERT_TYPE_ROCKETS = 1;
const ALERT_TYPE_UAV = 2;
const ALERT_TYPE_ADVANCE_NOTICE = 10000;

/*
 * Cache Key for retrieving polygons.json
 */
const POLYGON_VERSION_KEY = "polygons_version";

/*
 * The latest version of polygons.json, to be used for caching
 */
const POLYGON_VERSION_VALUE = "1.1";

/*
 * Checks whether the Alert Mode query string is set. Dev only.
 */
const isAlertModeQueryString = () => {
  const query = queryString.parse(window.location.search);
  const queryKeys = Object.keys(query);
  if (queryKeys.length !== 1) {
    return false;
  }
  return queryKeys[0].toLowerCase() === "mode" &&
    query[queryKeys[0]] === "alert"
    ? true
    : false;
};

const isLocalStorageAvailable = () => {
  if (typeof localStorage === "undefined") {
    return false;
  }

  // localStorage is defined, check if it's not turned off
  const test = "test";
  try {
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/*
 * Custom hook for tracking when sections of the page are visible in the viewport
 */
const useIsVisible = (ref) => {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    if (!ref || !ref.current) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    observer.observe(ref.current);
    return () => {
      observer.disconnect();
    };
  }, [ref]);

  return isIntersecting;
};

/*
 * Returns approx. distance from Gaza in KM based on
 * the number of seconds there are to find shelter
 */
const getDistanceByTimeToShelter = (timeToShelter) => {
  // https://upload.wikimedia.org/wikipedia/commons/d/d3/%D7%98%D7%95%D7%95%D7%97_%D7%99%D7%A8%D7%99_%D7%94%D7%A8%D7%A7%D7%98%D7%95%D7%AA_%D7%9E%D7%A8%D7%A6%D7%95%D7%A2%D7%AA_%D7%A2%D7%96%D7%94.png
  const TIME_TO_DISTANCE = {
    0: 5,
    15: 10,
    30: 20,
    45: 30,
    60: 40,
    90: 50,
    180: 120,
  };
  return TIME_TO_DISTANCE[timeToShelter];
};

const isRegionInSouth = (region) => {
  const REGIONS_IN_SOUTH = [
    "Gaza Envelope",
    "Western Negev",
    "Southern Negev",
    "Central Negev",
    "Shfelat Yehuda",
    "Shfela (Lowlands)",
    "Lakhish",
    "Western Lakhish",
  ];
  return REGIONS_IN_SOUTH.includes(region);
};

const isRegionInNorth = (region) => {
  const REGIONS_IN_NORTH = [
    "Judea",
    "Confrontation Line",
    "Northern Golan",
    "Southern Golan",
    "Upper Galilee",
    "Center Galilee",
    "Lower Galilee",
    "Wadi Ara",
    "Menashe",
    "HaAmakim",
    "Samaria",
    "HaMifratz",
    "HaCarmel",
    "Beit Sha'an Valley",
    "Dead Sea",
    "Eilat",
    "Arabah",
    "Bika'a",
    "Jerusalem",
    "Yarkon",
    "Dan",
    "Sharon",
  ];
  return REGIONS_IN_NORTH.includes(region);
};

const isSmallViewport = () =>
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) <
  768;

const isMediumViewport = () =>
  Math.max(document.documentElement.clientWidth || 0, window.innerWidth || 0) <
  1024;

const getAlertTypeText = (alert) => {
  let alertTypeText = "Red alert";
  if (alert?.alertTypeId === ALERT_TYPE_ROCKETS) {
    alertTypeText = "Rocket alert";
  } else if (alert?.alertTypeId === ALERT_TYPE_UAV) {
    alertTypeText = "Hostile UAV alert";
  }
  return alertTypeText;
};

/*
  Format chart xAxis label from "mm/dd/yy - mm/dd/yy" to "mm/yy"
  Used to shorten label for small viewports
*/
const buildxAxisLabel = () => {
  const xAxisLabel = {
    style: {
      fill: "black",
      fontSize: 14,
    },
  };

  if (isSmallViewport()) {
    const labelFormatter = (label) => {
      const [startDate] = label.split(" - ");
      const [startDay, , startYear] = startDate.split("/");
      return `${startDay}/${startYear}`;
    };
    xAxisLabel.formatter = labelFormatter;
  }

  return xAxisLabel;
};

/*
  Gets a list of alerts and determines the origin of each alert, based
  on the timestamp and the region of the alert.
*/
const determineAlertOrigin = (alerts) => {
  let originSouthCount = 0;
  let originNorthCount = 0;
  let originIranCount = 0;
  let originYemenCount = 0;

  alerts.forEach((alert) => {
    if (isConfirmedFalseAlert(alert.timeStamp)) {
      return;
    } else if (isIranianMissileAttackTimeFrame(alert.timeStamp)) {
      originIranCount += 1;
    } else if (isYemenMissileAttackTimeFrame(alert.timeStamp)) {
      originYemenCount += 1;
    }
    /*
      As of March 22, 2025, Hezbollah still fires rockets and so
      we can't just assume all alerts are from Hamas/Southv
    */
    // else if (isAfterCeaseFireInTheNorth(alert.timeStamp)) {
    //   originSouthCount += 1;
    // }
    else if (isRegionInSouth(alert.areaNameEn)) {
      originSouthCount += 1;
    } else if (isRegionInNorth(alert.areaNameEn)) {
      originNorthCount += 1;
    }
  });

  return {
    originSouthCount,
    originNorthCount,
    originIranCount,
    originYemenCount,
  };
};

const Util = {
  isDev: () =>
    process.env.NODE_ENV === "development" || process.env.NODE_ENV === "test",
  isAlertModeQueryString,
  isLocalStorageAvailable,
  useIsVisible,
  getDistanceByTimeToShelter,
  isRegionInSouth,
  isRegionInNorth,
  isSmallViewport,
  isMediumViewport,
  getAlertTypeText,
  buildxAxisLabel,
  determineAlertOrigin,
  REAL_TIME_ALERT_DISPLAY_DURATION,
  REAL_TIME_ALERT_THROTTLE_DURATION,
  MAX_RECENT_ALERTS,
  ALERT_TYPE_ALL,
  ALERT_TYPE_ROCKETS,
  ALERT_TYPE_UAV,
  ALERT_TYPE_ADVANCE_NOTICE,
  POLYGON_VERSION_KEY,
  POLYGON_VERSION_VALUE,
};

export default Util;
