import {
  getNow,
  isBiWeeklyDifference,
  weekRangeWithYearFormat,
  is8WeeksDifference,
} from "../../../utilities/date_helper";
import Utilities from "../../../utilities/utilities";
import { isAfter, isBefore } from "date-fns";

// The date from which the new, non-hardcoded graph data starts.
// Used for calculating alert count based on existing date intervals
const TOTAL_ALERTS_DYNAMIC_DATA_START_DATE = new Date(2025, 0, 13);
const TOTAL_ALERTS_MOBILE_DYNAMIC_DATA_START_DATE = new Date(2025, 1, 23);

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

const isRegionInSouth = (region) => {
  const REGIONS_IN_SOUTH = [
    "Gaza Envelope",
    "Western Negev",
    "Southern Negev",
    "Central Negev",
    "Shfelat Yehuda",
    "Shfela (Lowlands)",
    "Lakhish",
    "Western Lakhish",
  ];
  return REGIONS_IN_SOUTH.includes(region);
};

const isRegionInNorth = (region) => {
  const REGIONS_IN_NORTH = [
    "Judea",
    "Confrontation Line",
    "Northern Golan",
    "Southern Golan",
    "Upper Galilee",
    "Center Galilee",
    "Lower Galilee",
    "Wadi Ara",
    "Menashe",
    "HaAmakim",
    "Samaria",
    "HaMifratz",
    "HaCarmel",
    "Beit Sha'an Valley",
    "Dead Sea",
    "Eilat",
    "Arabah",
    "Bika'a",
    "Jerusalem",
    "Yarkon",
    "Dan",
    "Sharon",
  ];
  return REGIONS_IN_NORTH.includes(region);
};

const isInsideTimeframe = (date, timeframe) => {
  const theDate = new Date(date);
  return timeframe.some(([start, end]) => theDate >= start && theDate <= end);
};

const isAfterCeaseFireInTheNorth = (date) => {
  const ceaseFireDate = new Date("2024-11-27 04:00:00");
  return isAfter(new Date(date), ceaseFireDate);
};

const graphUtils = {
  ALERT_SOURCE,
  isRegionInSouth,
  isRegionInNorth,
  isInsideTimeframe,
  isAfterCeaseFireInTheNorth,

  /*
    Build graph data from dynamic data pulled from server.
    Shared between total alerts, rockets and UAV graphs.
  */
  buildNewData: (alertData, alertTimeframes) => {
    let data = [];
    let rocketAlertCount = 0;
    let UAVAlertCount = 0;
    let currentDate = TOTAL_ALERTS_DYNAMIC_DATA_START_DATE;
    let weekDiffFunction = isBiWeeklyDifference;
    if (Utilities.isSmallViewport()) {
      currentDate = TOTAL_ALERTS_MOBILE_DYNAMIC_DATA_START_DATE;
      weekDiffFunction = is8WeeksDifference;
    }

    alertData.forEach(({ alerts, date }) => {
      const [year, month, day] = date.split("-");
      const alertDate = new Date(year, month - 1, day);
      if (weekDiffFunction(currentDate, alertDate)) {
        const weekValue = weekRangeWithYearFormat(currentDate, alertDate);
        data.push({
          week: weekValue,
          alerts: rocketAlertCount,
          type: "Rockets",
        });
        data.push({
          week: weekValue,
          alerts: UAVAlertCount,
          type: "UAVs",
        });
        currentDate = alertDate;
        rocketAlertCount = 0;
        UAVAlertCount = 0;
      }

      if (!isBefore(alertDate, currentDate)) {
        const confirmedAlerts = alerts.filter(
          (alert) =>
            !isInsideTimeframe(alert.timeStamp, alertTimeframes.falseAlerts)
        );
        const rocketAlerts = confirmedAlerts.filter(
          (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_ROCKETS
        );
        const UAVAlerts = confirmedAlerts.filter(
          (alert) => alert.alertTypeId === Utilities.ALERT_TYPE_UAV
        );
        rocketAlertCount += rocketAlerts.length;
        UAVAlertCount += UAVAlerts.length;
      }
    });

    const week = weekRangeWithYearFormat(currentDate, getNow());
    data.push({
      week,
      alerts: rocketAlertCount,
      type: "Rockets",
    });
    data.push({
      week,
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

  /*
  Gets a list of alerts and determines the origin of each alert, based
  on the timestamp and the region of the alert.
  */
  determineAlertOrigin: (alerts, alertTimeframes) => {
    let originSouthCount = 0;
    let originNorthCount = 0;
    let originIranCount = 0;
    let originYemenCount = 0;

    alerts.forEach((alert) => {
      if (isInsideTimeframe(alert.timeStamp, alertTimeframes.falseAlerts)) {
        return;
      } else if (isInsideTimeframe(alert.timeStamp, alertTimeframes.iran)) {
        originIranCount += 1;
      } else if (isInsideTimeframe(alert.timeStamp, alertTimeframes.yemen)) {
        originYemenCount += 1;
      }
      /*
      As of March 22, 2025, Hezbollah still fires rockets and so
      we can't just assume all alerts are from Hamas/Southv
    */
      // else if (isAfterCeaseFireInTheNorth(alert.timeStamp)) {
      //   originSouthCount += 1;
      // }
      else if (isRegionInSouth(alert.areaNameEn)) {
        originSouthCount += 1;
      } else if (isRegionInNorth(alert.areaNameEn)) {
        originNorthCount += 1;
      }
    });

    return {
      originSouthCount,
      originNorthCount,
      originIranCount,
      originYemenCount,
    };
  },
};

export default graphUtils;
