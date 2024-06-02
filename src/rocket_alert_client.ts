import wretch from "wretch";
import isValid from "date-fns/isValid";
import { isoFormat, convertToServerTime } from "./date_helper";
import Util from "./util";

const SERVER_URL = "https://agg.rocketalert.live/api";
const APIv1 = wretch(`${SERVER_URL}/v1/alerts`);
// const APIv2 = wretch(`${SERVER_URL}/v2/alerts`);

/*
 *  Gets detailed alert data for alerts in the given date range
 *
 *  @param {string} from  from date, inclusive.
 *  @param {string} to    to date, inclusive.
 *  @return {object}
 */
const getDetailedAlerts = (
  from: string,
  to: string,
  alertType: number = Util.ALERT_TYPE_ROCKETS
) => {
  if (!from || !isValid(new Date(from))) {
    return Promise.reject(new Error("Invalid Date: from"));
  }
  if (!to || !isValid(new Date(to))) {
    return Promise.reject(new Error("Invalid Date: to"));
  }
  return APIv1.url("/details")
    .query({
      from: isoFormat(convertToServerTime(from)),
      to: isoFormat(convertToServerTime(to)),
      alertTypeId: alertType,
    })
    .get()
    .json();
};

const AlertClient = {
  getDetailedAlerts,

  /*
   *  Gets the MAX_RECENT_ALERTS most recent alerts in the past 24 hours.
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @return {object}
   */
  getMostRecentAlerts: (from: string, to: string): any => {
    return getDetailedAlerts(from, to)
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
    return APIv1.url("/daily")
      .query({
        from: isoFormat(convertToServerTime(from)),
        to: isoFormat(convertToServerTime(to)),
      })
      .get()
      .json();
  },

  /*
   *  Gets all real time alerts that occurred since the last alert history sync
   *
   *  @return {object}
   */
  getRealTimeAlertCache: (): any => {
    return APIv1.url("/real-time/cached")
      .get()
      .json()
      .then((res) => {
        if (!res.success) {
          return null;
        }
        // const payload: any = [];
        // res.payload.forEach((item: any) => payload.push(...item.alerts));
        // return payload;
        return res.payload;
      })
      .catch((err) => {
        console.log(err);
      });
  },

  /*
   *  Gets total alert count for the given date range
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @return {object}
   */
  getTotalAlerts: (
    from: string,
    to: string,
    alertType: number = Util.ALERT_TYPE_ROCKETS
  ): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return APIv1.url("/total")
      .query({
        from: isoFormat(convertToServerTime(from)),
        to: isoFormat(convertToServerTime(to)),
        alertTypeId: alertType,
      })
      .get()
      .json();
  },

  /*
   *  Gets the date and location of the most recent alert
   *
   *  @return {object}
   */
  getMostRecentAlert: (): any => APIv1.url("/latest").get().json(),

  /*
   *  Gets the top N most targeted locations
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @param {number} max   number of locations. Defaults to 10
   *  @return {object}
   */
  getMostTargetedLocations: (
    from: string,
    to: string,
    max: number = 10
  ): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return APIv1.url("/top/place")
      .query({
        from: isoFormat(convertToServerTime(from)),
        to: isoFormat(convertToServerTime(to)),
        limit: max,
      })
      .get()
      .json();
  },

  /*
   *  Gets the top N most targeted regions
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @param {number} max   number of locations. Defaults to 10
   *  @return {object}
   */
  getMostTargetedRegions: (from: string, to: string, max: number = 10): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return APIv1.url("/top/area")
      .query({
        from: isoFormat(convertToServerTime(from)),
        to: isoFormat(convertToServerTime(to)),
        limit: max,
      })
      .get()
      .json();
  },

  /*
   *  Opens a persistent connection for interfacing with the server-sent events
   *
   *  @param {string} url   url of the event source
   *  @return {EventSource} the EventSource instance
   */
  getRealTimeAlertEventSource: (
    url = Util.isAlertModeQueryString()
      ? `${SERVER_URL}/v2/alerts/real-time-test`
      : `${SERVER_URL}/v2/alerts/real-time`
  ) => new EventSource(url),
};

export default AlertClient;
