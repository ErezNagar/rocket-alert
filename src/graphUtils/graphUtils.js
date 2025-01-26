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
// const DYNAMIC_DATA_START_DATE = new Date(2023, 9, 7);
// const DYNAMIC_DATA_START_DATE = new Date(2025, 0, 5);
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
    let alertCount = 0;
    let weekDate = TOTAL_ALERTS_DYNAMIC_DATA_START_DATE;
    let weekDiffFunction = isBiWeeklyDifference;
    if (Util.isSmallViewport()) {
      weekDate = TOTAL_ALERTS_MOBILE_DYNAMIC_DATA_START_DATE;
      weekDiffFunction = is5WeeksDifference;
    }

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (weekDiffFunction(weekDate, theDate)) {
        data.push({
          week: weekRangeWithYearFormat(weekDate, theDate),
          alerts: alertCount,
        });
        weekDate = theDate;
        alertCount = 0;
      }

      if (!isBefore(theDate, weekDate)) {
        alertCount += alerts.length;
      }
    });

    data.push({
      week: weekRangeWithYearFormat(weekDate, getNow()),
      alerts: alertCount,
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
