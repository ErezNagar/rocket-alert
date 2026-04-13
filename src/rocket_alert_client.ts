import wretch from "wretch";
import isValid from "date-fns/isValid";
import { isoFormat, convertToServerTime } from "./utilities/date_helper";
import Utilities from "./utilities/utilities";

const SERVER_URL = "https://agg.rocketalert.live/api";
const V1 = `${SERVER_URL}/v1`;
const V2 = `${SERVER_URL}/v2`;
const APIv1 = wretch(`${V1}/alerts`);
const APIv2 = wretch(`${V2}/alerts`);

/*
  Utility function to filter only rocket and UAV alerts
*/
const filterRocketAndUAVAlerts = (res: any) => {
  res.payload.forEach((date: any) => {
    date.alerts = date.alerts.filter(
      (alert: any) =>
        alert.alertTypeId === Utilities.ALERT_TYPE_ROCKETS ||
        alert.alertTypeId === Utilities.ALERT_TYPE_UAV,
    );
  });
  return res;
};

const AlertClient = {
  /*
   *  Gets full alert data for all alerts in the past 48 hours.
   */
  getMostRecentAlerts: (): any =>
    APIv1.url("/past48h")
      .get()
      .json()
      .then(filterRocketAndUAVAlerts)
      .then((res) => {
        if (!res.success) {
          return null;
        }

        if (res.payload.length === 0) {
          return res.payload;
        }

        const alerts = res.payload.length
          ? res.payload.flatMap((p: any) => p.alerts).reverse()
          : [];

        return alerts.filter(
          (alert: any) => alert.lon !== null || alert.lat !== null,
        );
      })
      .catch((e) => {
        console.error("Error getMostRecentAlerts", e);
      }),
  /*
   *  Gets total alert count by day for the given date range
   *
   *  @param {string} from  from date, inclusive.
   *  @param {string} to    to date, inclusive.
   *  @return {object}
   */
  getTotalAlertsByDay: (
    from: string,
    to: string,
    alertTypeId: number = Utilities.ALERT_TYPE_ALL,
  ): any => {
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
        alertTypeId,
      })
      .get()
      .json();
  },

  /*
   *  Gets all real time alerts that occurred since the last alert history sync
   *
   *  @return {object}
   */
  getRealTimeAlertCache: (): any =>
    APIv2.url("/real-time/cached")
      .get()
      .json()
      .then((res) => {
        if (!res.success) {
          return null;
        }
        const payload: any = {
          alerts: [],
          count: res.payload.length,
        };

        const allAlerts: any[] = [];
        res.payload.forEach((item: any) => allAlerts.push(...item.alerts));

        // Filter out duplicate alerts based on location name
        const seenAlertLocations: any[] = [];
        allAlerts.forEach((alert: any) => {
          if (seenAlertLocations.includes(alert.englishName)) {
            return;
          } else {
            seenAlertLocations.push(alert.englishName);
            payload.alerts.push(alert);
          }
        });

        payload.count = payload.alerts.length;
        return payload;
      })
      .catch((err) => {
        console.log(err);
      }),
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
    alertTypeId: number = Utilities.ALERT_TYPE_ALL,
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
        alertTypeId,
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
    max: number = 10,
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
   *  Gets header data for the given timezone
   *
   *  @param {string} timezone  IANA timezone string. Defaults to "Asia/Jerusalem"
   *  @return {object}
   */
  getHeaderData: (timezone: string = "Asia/Jerusalem"): any => {
    return APIv1.url(`/header/${timezone}`).query({}).get().json();
  },

  /*
   *  Opens a persistent connection for interfacing with the server-sent events
   *
   *  @param {string} url   url of the event source
   *  @return {EventSource} the EventSource instance
   */
  getRealTimeAlertEventSource: (
    url = Utilities.isAlertModeQueryString()
      ? `${V2}/alerts/real-time-test?alertTypeId=${Utilities.ALERT_TYPE_ALL}`
      : `${V2}/alerts/real-time`,
  ) => new EventSource(url),
};

export default AlertClient;
