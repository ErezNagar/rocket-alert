import queryString from "query-string";
import { useEffect, useState } from "react";

/*
 * The duration in milliseconds of the css transition for real-time alert
 */
const REAL_TIME_ALERT_TRANSITION_DURATION = 400;

/*
 * The interval in milliseconds in which real-time alerts are read from the alert queue
 * Set to display time + total transition time;
 */
const REAL_TIME_ALERT_THROTTLE_DURATION = 7000;

/*
 * The duration in milliseconds in which a real-time alert is shown, not including css transition time
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
    "Judea",
    "Lakhish",
    "Western Lakhish",
    "Dead Sea",
    "Eilat",
    "Arabah",
    "Bika'a",
    "Jerusalem",
    "Yarkon",
    "Dan",
    "Sharon",
  ];
  return REGIONS_IN_SOUTH.includes(region);
};

const isRegionInNorth = (region) => {
  const REGIONS_IN_NORTH = [
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
  if (alert?.alertTypeId === Util.ALERT_TYPE_ROCKETS) {
    alertTypeText = "Rocket alert";
  } else if (alert?.alertTypeId === Util.ALERT_TYPE_UAV) {
    alertTypeText = "Hostile UAV alert";
  }
  return alertTypeText;
};

const Util = {
  isDev: () => process.env.NODE_ENV === "development",
  isAlertModeQueryString,
  isLocalStorageAvailable,
  useIsVisible,
  getDistanceByTimeToShelter,
  isRegionInSouth,
  isRegionInNorth,
  isSmallViewport,
  isMediumViewport,
  getAlertTypeText,
  REAL_TIME_ALERT_TRANSITION_DURATION,
  REAL_TIME_ALERT_DISPLAY_DURATION,
  REAL_TIME_ALERT_THROTTLE_DURATION,
  MAX_RECENT_ALERTS,
  ALERT_TYPE_ALL,
  ALERT_TYPE_ROCKETS,
  ALERT_TYPE_UAV,
};

export default Util;
