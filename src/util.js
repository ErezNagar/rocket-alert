import queryString from "query-string";

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
 * The interval in milliseconds between each header alert summary data request. Set to 1 hour.
 */
const HEADER_ALERT_SUMMARY_REFRESH_INTERVAL = 3600000;

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

const Util = {
  isDev: () => process.env.NODE_ENV === "development",
  isAlertModeQueryString,
  isLocalStorageAvailable,
  REAL_TIME_ALERT_TRANSITION_DURATION,
  REAL_TIME_ALERT_DISPLAY_DURATION,
  REAL_TIME_ALERT_THROTTLE_DURATION,
  HEADER_ALERT_SUMMARY_REFRESH_INTERVAL,
};

export default Util;
