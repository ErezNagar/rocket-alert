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

const isIranianMissileAttackTimeFrame = (date) => {
  const theDate = new Date(date);
  // Rounded to the nearest minute
  const IranAttackTimeframes = [
    [new Date("2024-04-14 01:42:00"), new Date("2024-04-14 01:58:00")],
    [new Date("2024-10-01 18:37:00"), new Date("2024-10-01 19:59:00")],
    [new Date("2025-06-13 21:10:00"), new Date("2025-06-14 09:02:00")],
    [new Date("2025-06-14 23:10:00"), new Date("2025-06-15 16:13:00")],
    [new Date("2025-06-15 20:37:00"), new Date("2025-06-16 04:37:00")],
    [new Date("2025-06-16 10:45:00"), new Date("2025-06-19 07:36:00")],
    [new Date("2025-06-19 14:46:26"), new Date("2025-06-23 11:35:00")],
    [new Date("2025-06-24 01:34:00"), new Date("2025-06-24 10:35:00")],
  ];

  return (
    IranAttackTimeframes.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};

const isYemenMissileAttackTimeFrame = (date) => {
  const theDate = new Date(date);
  // Rounded to the nearest minute
  const YemenAttackTimeframes = [
    [new Date("2024-09-15 06:30:00"), new Date("2024-09-15 06:35:00")],
    [new Date("2024-09-27 00:40:00"), new Date("2024-09-27 00:42:00")],
    [new Date("2024-09-28 17:41:00"), new Date("2024-09-28 17:44:00")],
    [new Date("2024-10-07 17:42:00"), new Date("2024-10-07 17:46:00")],
    [new Date("2024-12-01 06:21:00"), new Date("2024-12-01 06:23:00")],
    [new Date("2024-12-12 08:52:00"), new Date("2024-12-12 09:06:00")],
    [new Date("2024-12-16 15:18:00"), new Date("2024-12-16 15:20:00")],
    [new Date("2024-12-19 02:36:00"), new Date("2024-12-19 02:37:00")],
    [new Date("2024-12-21 03:43:00"), new Date("2024-12-21 03:45:00")],
    [new Date("2024-12-21 14:53:00"), new Date("2024-12-21 14:57:00")],
    [new Date("2024-12-24 01:44:00"), new Date("2024-12-24 01:47:00")],
    [new Date("2024-12-25 04:21:00"), new Date("2024-12-25 17:28:00")],
    [new Date("2024-12-27 03:29:00"), new Date("2024-12-27 03:30:00")],
    [new Date("2024-12-28 02:11:00"), new Date("2024-12-28 02:13:00")],
    [new Date("2024-12-30 23:09:00"), new Date("2024-12-30 23:12:00")],
    [new Date("2025-01-03 04:34:00"), new Date("2025-01-03 04:36:00")],
    [new Date("2025-01-05 00:20:00"), new Date("2025-01-05 00:21:00")],
    [new Date("2025-01-09 20:07:00"), new Date("2025-01-09 20:08:00")],
    [new Date("2025-01-13 18:38:00"), new Date("2025-01-13 18:39:00")],
    [new Date("2025-01-14 03:02:00"), new Date("2025-01-14 03:04:00")],
    [new Date("2025-01-18 10:18:00"), new Date("2025-01-18 10:20:00")],
    [new Date("2025-01-18 15:39:00"), new Date("2025-01-18 15:40:00")],
    [new Date("2025-03-18 18:56:00"), new Date("2025-03-18 18:57:00")],
    [new Date("2025-03-20 03:59:00"), new Date("2025-03-20 04:01:00")],
    [new Date("2025-03-20 13:21:00"), new Date("2025-03-20 13:23:00")],
    [new Date("2025-03-20 19:28:00"), new Date("2025-03-20 19:31:00")],
    [new Date("2025-03-21 22:31:00"), new Date("2025-03-21 22:34:00")],
    [new Date("2025-03-23 07:23:00"), new Date("2025-03-23 07:24:00")],
    [new Date("2025-03-24 19:59:00"), new Date("2025-03-24 20:02:00")],
    [new Date("2025-03-27 13:09:00"), new Date("2025-03-27 13:10:00")],
    [new Date("2025-03-30 10:41:00"), new Date("2025-03-30 10:43:00")],
    [new Date("2025-04-13 18:15:00"), new Date("2025-04-13 18:17:00")],
    [new Date("2025-04-18 06:35:00"), new Date("2025-04-18 06:38:00")],
    [new Date("2025-04-23 03:58:00"), new Date("2025-04-23 03:59:00")],
    [new Date("2025-04-26 02:42:00"), new Date("2025-04-26 02:47:00")],
    [new Date("2025-04-27 04:49:00"), new Date("2025-04-27 04:51:00")],
    [new Date("2025-05-02 05:25:00"), new Date("2025-05-02 13:39:00")],
    [new Date("2025-05-03 06:18:00"), new Date("2025-05-03 06:26:00")],
    [new Date("2025-05-04 09:17:00"), new Date("2025-05-04 09:23:00")],
    [new Date("2025-05-09 16:22:00"), new Date("2025-05-09 16:26:00")],
    [new Date("2025-05-13 19:24:00"), new Date("2025-05-13 19:28:00")],
    [new Date("2025-05-14 07:40:00"), new Date("2025-05-14 07:45:00")],
    [new Date("2025-05-15 21:07:00"), new Date("2025-05-15 21:12:00")],
    [new Date("2025-05-18 01:56:00"), new Date("2025-05-18 02:03:00")],
    [new Date("2025-05-22 02:53:00"), new Date("2025-05-22 03:01:00")],
    [new Date("2025-05-22 11:50:00"), new Date("2025-05-22 11:53:00")],
    [new Date("2025-05-23 04:09:00"), new Date("2025-05-23 04:12:00")],
    [new Date("2025-05-25 10:49:00"), new Date("2025-05-25 10:55:00")],
    [new Date("2025-05-27 04:59:00"), new Date("2025-05-27 05:05:00")],
    [new Date("2025-05-29 21:18:00"), new Date("2025-05-29 21:24:00")],
    [new Date("2025-06-01 16:47:00"), new Date("2025-06-01 16:53:00")],
    [new Date("2025-06-02 20:50:00"), new Date("2025-06-02 20:55:00")],
    [new Date("2025-06-03 21:57:00"), new Date("2025-06-03 22:01:00")],
    [new Date("2025-06-05 21:47:00"), new Date("2025-06-05 21:49:00")],
    [new Date("2025-06-10 19:50:00"), new Date("2025-06-10 19:52:00")],
    [new Date("2025-06-13 19:32:00"), new Date("2025-06-13 19:33:00")],
    [new Date("2025-06-16 10:17:00"), new Date("2025-06-16 10:18:00")],
    [new Date("2025-06-28 07:10:00"), new Date("2025-06-28 07:13:00")],
    [new Date("2025-07-01 20:27:00"), new Date("2025-07-01 20:29:00")],
    [new Date("2025-07-06 02:51:00"), new Date("2025-07-06 02:52:00")],
    [new Date("2025-07-07 03:45:00"), new Date("2025-07-07 03:48:00")],
  ];

  return (
    YemenAttackTimeframes.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};

const isAfterCeaseFireInTheNorth = (date) => {
  const ceaseFireDate = new Date("2024-11-27 04:00:00");
  return isAfter(new Date(date), ceaseFireDate);
};

const isConfirmedFalseAlert = (date) => {
  const theDate = new Date(date);
  // Rounded to the nearest minute
  const confirmedFalseAlerts = [
    [new Date("2025-01-30 08:35:00"), new Date("2025-01-30 08:37:00")],
    [new Date("2025-02-08 15:53:00"), new Date("2025-02-08 15:54:00")],
    [new Date("2025-02-25 08:39:00"), new Date("2025-02-25 08:41:00")],
    [new Date("2025-03-08 06:58:00"), new Date("2025-03-08 06:59:00")],
    [new Date("2025-03-24 11:55:00"), new Date("2025-03-24 11:56:00")],
    [new Date("2025-04-03 08:37:00"), new Date("2025-04-03 08:38:00")],
    [new Date("2025-04-03 23:49:00"), new Date("2025-04-03 23:50:00")],
    [new Date("2025-04-22 23:42:00"), new Date("2025-04-22 23:43:00")],
    [new Date("2025-05-06 08:39:00"), new Date("2025-05-06 08:40:00")],
    [new Date("2025-05-23 19:11:00"), new Date("2025-05-23 19:12:00")],
    [new Date("2025-05-27 07:15:00"), new Date("2025-05-27 07:16:00")],
    [new Date("2025-05-30 20:14:00"), new Date("2025-05-30 20:22:00")],
    [new Date("2025-06-19 12:15:00"), new Date("2025-06-19 12:16:00")],
    [new Date("2025-06-23 19:36:00"), new Date("2025-06-23 19:37:00")],
    [new Date("2025-06-26 17:42:00"), new Date("2025-06-26 17:43:00")],
    [new Date("2025-07-04 07:24:00"), new Date("2025-07-04 07:25:00")],
    [new Date("2025-07-07 23:39:00"), new Date("2025-07-07 23:40:00")],
  ];

  return (
    confirmedFalseAlerts.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};

const graphUtils = {
  ALERT_SOURCE,
  isRegionInSouth,
  isRegionInNorth,
  isIranianMissileAttackTimeFrame,
  isYemenMissileAttackTimeFrame,
  isAfterCeaseFireInTheNorth,
  isConfirmedFalseAlert,

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
          (alert) => !isConfirmedFalseAlert(alert.timeStamp)
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
  determineAlertOrigin: (alerts) => {
    let originSouthCount = 0;
    let originNorthCount = 0;
    let originIranCount = 0;
    let originYemenCount = 0;

    alerts.forEach((alert) => {
      if (isConfirmedFalseAlert(alert.timeStamp)) {
        return;
      } else if (isIranianMissileAttackTimeFrame(alert.timeStamp)) {
        originIranCount += 1;
      } else if (isYemenMissileAttackTimeFrame(alert.timeStamp)) {
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
