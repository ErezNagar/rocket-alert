import wretch from "wretch";
import isValid from "date-fns/isValid";
import { isoFormat } from "./date_helper";
import Util from "./util";

const SERVER_URL = "https://agg.rocketalert.live/api/v1/alerts";
const api = wretch(SERVER_URL);

const AlertClient = {
  /*
   *  Gets the MAX_RECENT_ALERTS most recent alerts in the past 24 hours.
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @return {object}
   */
  getMostRecentAlerts: (from: string, to: string): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return api
      .url("/details")
      .query({ from: isoFormat(from), to: isoFormat(to) })
      .get()
      .json()
      .then((res) => {
        if (!res.success) {
          return null;
        }
        const alerts =
          res?.payload?.length > 1
            ? res.payload[0].alerts.concat(res.payload[1].alerts)
            : res.payload[0].alerts;
        return alerts.slice(-Util.MAX_RECENT_ALERTS);
      })
      .catch((e) => {
        console.log("e", e);
      });
  },

  /*
   *  Gets total alert count by day for the given date range
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @return {object}
   */
  getTotalAlertsByDay: (from: string, to: string): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return api
      .url("/daily")
      .query({ from: isoFormat(from), to: isoFormat(to) })
      .get()
      .json();
  },

  /*
   *  Gets all real time alerts that occurred since the last alert history sync
   *
   *  @return {object}
   */
  getRealTimeAlertCache: (): any => {
    return api
      .url("/real-time/cached")
      .get()
      .json()
      .then((res) => {
        if (!res.success) {
          return null;
        }
        return res.payload;
      });
  },

  /*
   *  Gets total alert count for the given date range
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @return {object}
   */
  getTotalAlerts: (from: string, to: string): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return api
      .url("/total")
      .query({ from: isoFormat(from), to: isoFormat(to) })
      .get()
      .json();
  },

  /*
   *  Gets the date and location of the most recent alert
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
    url = Util.isAlertModeQueryString()
      ? `${SERVER_URL}/real-time-test`
      : `${SERVER_URL}/real-time`
  ) => new EventSource(url),
};

export default AlertClient;
