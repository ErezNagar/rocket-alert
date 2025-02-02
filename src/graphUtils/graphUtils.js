import {
  getNow,
  isBiWeeklyDifference,
  weekRangeWithYearFormat,
  is5WeeksDifference,
} from "../date_helper";
import Util from "../util";
import { isBefore } from "date-fns";

// The date from which the new, non-hardcoded graph data starts.
// Used for calculating alert count based on existing date intervals
const TOTAL_ALERTS_DYNAMIC_DATA_START_DATE = new Date(2025, 0, 13);
const TOTAL_ALERTS_MOBILE_DYNAMIC_DATA_START_DATE = new Date(2025, 0, 5);

const ALERT_SOURCE = {
  HAMAS: {
    LABEL: "Hamas (Gaza)",
    COLOR: "#008000",
  },
  HEZBOLLAH: {
    LABEL: "Hezbollah (Southern Lebanon)",
    COLOR: "#F7E210",
  },
  IRAN: {
    LABEL: "Iran",
    COLOR: "#DA0000",
  },
  HOUTHIS: {
    LABEL: "Houthis (Yemen)",
    COLOR: "black",
  },
};

const graphUtils = {
  ALERT_SOURCE,

  /*
    Build graph data from dynamic data pulled from server.
    Shared between total alerts, rockets and UAV graphs.
  */
  buildNewData: (alertData) => {
    let data = [];
    let rocketAlertCount = 0;
    let UAVAlertCount = 0;
    let currentDate = TOTAL_ALERTS_DYNAMIC_DATA_START_DATE;
    let weekDiffFunction = isBiWeeklyDifference;
    if (Util.isSmallViewport()) {
      currentDate = TOTAL_ALERTS_MOBILE_DYNAMIC_DATA_START_DATE;
      weekDiffFunction = is5WeeksDifference;
    }

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const alertDate = new Date(year, month - 1, day);
      if (weekDiffFunction(currentDate, alertDate)) {
        data.push({
          week: weekRangeWithYearFormat(currentDate, alertDate),
          alerts: rocketAlertCount,
          type: "Rockets",
        });
        data.push({
          week: weekRangeWithYearFormat(currentDate, alertDate),
          alerts: UAVAlertCount,
          type: "UAVs",
        });
        currentDate = alertDate;
        rocketAlertCount = 0;
        UAVAlertCount = 0;
      }

      if (!isBefore(alertDate, currentDate)) {
        const rocketAlerts = alerts.filter(
          (alert) => alert.alertTypeId === Util.ALERT_TYPE_ROCKETS
        );
        const UAVAlerts = alerts.filter(
          (alert) => alert.alertTypeId === Util.ALERT_TYPE_UAV
        );
        rocketAlertCount += rocketAlerts.length;
        UAVAlertCount += UAVAlerts.length;
      }
    });

    data.push({
      week: weekRangeWithYearFormat(currentDate, getNow()),
      alerts: rocketAlertCount,
      type: "Rockets",
    });
    data.push({
      week: weekRangeWithYearFormat(currentDate, getNow()),
      alerts: UAVAlertCount,
      type: "UAVs",
    });

    return data;
  },

  /*
    Concatenate pre-compiled hardcoded graph data with dynamic data pulled server.
    For Alerts By Day graph
  */
  concatAlertsByDayGraphData: (precompiledData, data) => {
    Object.keys(data).forEach((yearKey) => {
      if (yearKey !== "years") {
        precompiledData[yearKey] = data[yearKey];
      }
    });
    precompiledData.years.push(...data.years);
    return precompiledData;
  },

  getColorByOrigin: ({ origin }) => {
    if (origin === ALERT_SOURCE.HAMAS.LABEL) {
      return ALERT_SOURCE.HAMAS.COLOR;
    }
    if (origin === ALERT_SOURCE.HEZBOLLAH.LABEL) {
      return ALERT_SOURCE.HEZBOLLAH.COLOR;
    }
    if (origin === ALERT_SOURCE.IRAN.LABEL) {
      return ALERT_SOURCE.IRAN.COLOR;
    }
    if (origin === ALERT_SOURCE.HOUTHIS.LABEL) {
      return ALERT_SOURCE.HOUTHIS.COLOR;
    }
  },
};

export default graphUtils;
