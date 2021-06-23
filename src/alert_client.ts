import wretch from "wretch";
import isValid from "date-fns/isValid";

const api = wretch("https://ra-agg.kipodopik.com/api/public/alerts/");

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
    return (
      api
        .url("/daily")
        .query({ from, to })
        .get()
        //   .badRequest((error) => console.log(error.status))
        .json()
        .catch((error) => {
          console.log({ error });
          return null;
        })
    );
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
    return (
      api
        .url("/total")
        .query({ from, to })
        .get()
        //   .badRequest((error) => console.log(error.status))
        .json()
        .catch((error) => {
          console.log({ error });
          return null;
        })
    );
  },
};

export default AlertClient;
