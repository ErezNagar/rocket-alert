import {
  getNow,
  isBiWeeklyDifference,
  weekRangeWithYearFormat,
  is5WeeksDifference,
} from "../date_helper";
import Util from "../util";

// The date from which the graph date interval will start
const BEGINNING_DATE_INTERVAL = new Date(2024, 11, 30);

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
    Build graph from dynamic data pulled from server.
  */
  buildNewGraphData: (alertData) => {
    let data = [];
    let biweeklyAlertCount = 0;
    let weekDate = BEGINNING_DATE_INTERVAL;
    const weekDiffFunction = Util.isSmallViewport()
      ? is5WeeksDifference
      : isBiWeeklyDifference;

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const theDate = new Date(year, month - 1, day);
      if (weekDiffFunction(weekDate, theDate)) {
        data.push({
          week: weekRangeWithYearFormat(weekDate, theDate),
          alerts: biweeklyAlertCount,
        });
        weekDate = theDate;
        biweeklyAlertCount = 0;
      }

      biweeklyAlertCount += alerts.length;
    });

    data.push({
      week: weekRangeWithYearFormat(weekDate, getNow()),
      alerts: biweeklyAlertCount,
    });

    return data;
  },

  /*
    Concatenates pre-compiled hardcoded graph data with dynamic data pulled server.
  */
  concatGraphData: (precompiledData, data, deleteCount = 1) => {
    data.splice(0, deleteCount);
    return [...precompiledData, ...data];
  },

  /*
    Concatenates pre-compiled hardcoded graph data with dynamic data pulled server.
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
