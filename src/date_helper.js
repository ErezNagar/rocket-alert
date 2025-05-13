import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  formatISO,
  format,
  differenceInWeeks,
  startOfToday,
  startOfYesterday,
  endOfYesterday,
  isAfter,
  isBefore,
} from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const convertToLocalTime = (date) =>
  zonedTimeToUtc(date, "Asia/Jerusalem");

export const convertToServerTime = (date) =>
  utcToZonedTime(date, "Asia/Jerusalem");

export const isoFormat = (date) => {
  const dateTimeISO = formatISO(date);
  if (new Date(dateTimeISO).getTimezoneOffset() !== 0) {
    return dateTimeISO.substring(0, dateTimeISO.length - 6);
  }
  return dateTimeISO;
};

export const displayFormat = (date) => format(date, "MMM d, yyyy");

export const alertTimeDisplayFormat = (date) => format(date, "HH:mm");

export const dayOfMonthFormat = (date) => format(date, "M/d");

export const dayOfMonthWithYearFormat = (date) => format(date, "M/d/yy");

export const isBiWeeklyDifference = (fromDate, toDate) => {
  const diff = differenceInWeeks(fromDate, toDate);
  return Math.abs(diff) === 2 ? true : false;
};

export const is3WeeksDifference = (fromDate, toDate) => {
  const diff = differenceInWeeks(fromDate, toDate);
  return Math.abs(diff) === 3 ? true : false;
};

export const isAMonthDifference = (fromDate, toDate) => {
  const diff = differenceInWeeks(fromDate, toDate);
  return Math.abs(diff) === 4 ? true : false;
};

export const is5WeeksDifference = (fromDate, toDate) => {
  const diff = differenceInWeeks(fromDate, toDate);
  return Math.abs(diff) === 5 ? true : false;
};

export const weekRangeFormat = (fromDate, toDate) =>
  `${dayOfMonthFormat(fromDate)} - ${dayOfMonthFormat(subDays(toDate, 1))}`;

export const weekRangeWithYearFormat = (fromDate, toDate) =>
  `${dayOfMonthWithYearFormat(fromDate)} - ${dayOfMonthWithYearFormat(
    subDays(toDate, 1)
  )}`;

export const getNow = () => new Date();

export const getStartOfToday = () => startOfToday();

export const getStartOfYesterday = () => startOfYesterday();

export const getEndOfYesterday = () => endOfYesterday();

export const get24HoursAgo = () => subDays(new Date(), 1);

export const getYesterday = () => subDays(new Date(), 1);

export const getPastWeek = () => subWeeks(new Date(), 1);

export const getPastMonth = () => subMonths(new Date(), 1);

export const getPastYear = () => subYears(new Date(), 1);

export const isIranianMissileAttackTimeFrame = (date) => {
  const theDate = new Date(date);
  // Rounded to the nearest minute
  const IranAttackTimeframes = [
    [new Date("2024-04-14 01:42:00"), new Date("2024-04-14 01:58:00")],
    [new Date("2024-10-01 18:37:00"), new Date("2024-10-01 19:59:00")],
  ];

  return (
    IranAttackTimeframes.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};

export const isYemenMissileAttackTimeFrame = (date) => {
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
    [new Date("2025-05-13 19:24:00"), new Date("2025-05-13 21:45:00")],
  ];

  return (
    YemenAttackTimeframes.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};

export const isAfterCeaseFireInTheNorth = (date) => {
  const ceaseFireDate = new Date("2024-11-27 04:00:00");
  return isAfter(new Date(date), ceaseFireDate);
};

export const isConfirmedFalseAlert = (date) => {
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
  ];

  return (
    confirmedFalseAlerts.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};
