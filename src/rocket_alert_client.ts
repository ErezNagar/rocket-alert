import wretch from "wretch";
import isValid from "date-fns/isValid";

const SERVER_URL = "https://ra-agg.kipodopik.com/api/v1/alerts";
const api = wretch(SERVER_URL);

const AlertClient = {
  /*
   *  Gets total alert count by day for the given date range
   *  @param {string} from  from date, inclusive
   *  @param {string} to    to date, exclusive
   *  @return {object}
   */
  getTotalAlertsByDay: (from: string, to: string): any => {
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
   *  @param {string} from  from date, inclusive
   *  @param {string} to    to date, exclusive
   *  @return {object}
   */
  getTotalAlerts: (from: string, to: string): any => {
    if (!from || !isValid(new Date(from))) {
      return Promise.reject(new Error("Invalid Date: from"));
    }
    if (!to || !isValid(new Date(to))) {
      return Promise.reject(new Error("Invalid Date: to"));
    }
    return api.url("/total").query({ from, to }).get().json();
  },

  /*
   *  Opens a persistent connection for interfacing with the server-sent events
   *  @param {string} url   url of the event source
   *  @return {EventSource} the EventSource instance
   */
  getRealTimeAlertEventSource: (url = `${SERVER_URL}/real-time`) =>
    new EventSource(url),
};

export default AlertClient;
