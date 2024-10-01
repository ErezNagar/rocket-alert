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

export const isIranianMissileAttackTimeFrame = (date) => {
  const theDate = new Date(date);
  const IranAttackTimeframes = [
    [new Date("2024-04-14 01:42:00"), new Date("2024-04-14 01:58:00")],
    [new Date("2024-10-01 18:37:30"), new Date("2024-10-01 19:58:35")],
  ];

  return (
    IranAttackTimeframes.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};

export const isYemenMissileAttackTimeFrame = (date) => {
  const theDate = new Date(date);
  const YemenAttackTimeframes = [
    [new Date("2024-09-15 06:30:00"), new Date("2024-09-15 06:35:00")],
    [new Date("2024-09-27 00:40:00"), new Date("2024-09-27 00:42:00")],
    [new Date("2024-09-27 00:40:00"), new Date("2024-09-27 00:42:00")],
    [new Date("2024-09-28 17:41:04"), new Date("2024-09-28 17:42:03")],
  ];

  return (
    YemenAttackTimeframes.filter(
      ([start, end]) => isAfter(theDate, start) && isBefore(theDate, end)
    ).length !== 0
  );
};

export const getNow = () => new Date();

export const getStartOfToday = () => startOfToday();

export const getStartOfYesterday = () => startOfYesterday();

export const getEndOfYesterday = () => endOfYesterday();

export const get24HoursAgo = () => subDays(new Date(), 1);

export const getYesterday = () => subDays(new Date(), 1);

export const getPastWeek = () => subWeeks(new Date(), 1);

export const getPastMonth = () => subMonths(new Date(), 1);

export const getPastYear = () => subYears(new Date(), 1);
