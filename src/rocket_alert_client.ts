import wretch from "wretch";
import isValid from "date-fns/isValid";
import { getToday, isoFormat } from "./date_helper";
import Util from "./util";

const SERVER_URL = "https://ra-agg.kipodopik.com/api/v1/alerts";
const api = wretch(SERVER_URL);
const today = isoFormat(getToday());
const MAX_RECENT_ALERTS = 15;

const AlertClient = {
  /*
   *  Gets the MAX_RECENT_ALERTS most recent alerts of the past 24 hours
   *  If server time is tomorrow, we concat the 2 arrays of alerts.
   *
   *  @param {string} from  from date, inclusive. Defaults to today
   *  @param {string} to    to date, inclusive. Defaults to today
   *  @return {object}
   */
  getRecentAlerts: (from: string, to: string): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return api
      .url("/details")
      .query({ from, to })
      .get()
      .json()
      .then((res) => {
        if (!res.success || res.payload?.length === 0) {
          return null;
        }
        const alerts =
          res?.payload?.length > 1
            ? res.payload[0].alerts.concat(res.payload[1].alerts)
            : res.payload[0].alerts;
        return alerts.slice(-MAX_RECENT_ALERTS);
      })
      .catch((e) => {
        console.log("e", e);
      });
  },

  /*
   *  Gets total alert count by day for the given date range
   *
   *  @param {string} from  from date, inclusive
   *  @param {string} to    to date, inclusive. Defaults to today
   *  @return {object}
   */
  getTotalAlertsByDay: (from: string, to: string = today): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return api.url("/daily").query({ from, to }).get().json();
  },

  /*
   *  Gets total alert count for the given date range
   *
   *  @param {string} from  from date, inclusive
   *  @param {string} to    to date, inclusive. Defaults to today
   *  @return {object}
   */
  getTotalAlerts: (from: string, to: string = today): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return api.url("/total").query({ from, to }).get().json();
  },

  /*
   *  Gets the date and location most recent alert
   *
   *  @return {object}
   */
  getMostRecentAlert: (): any => api.url("/latest").get().json(),

  /*
   *  Opens a persistent connection for interfacing with the server-sent events
   *
   *  @param {string} url   url of the event source
   *  @return {EventSource} the EventSource instance
   */
  getRealTimeAlertEventSource: (
    url = Util.isDev() && Util.isAlertModeQueryString()
      ? `${SERVER_URL}/real-time-test`
      : `${SERVER_URL}/real-time`
  ) => new EventSource(url),
};

export default AlertClient;
