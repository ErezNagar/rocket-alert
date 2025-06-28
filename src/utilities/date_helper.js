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
  return Math.abs(diff) >= 2 ? true : false;
};

export const is4WeeksDifference = (fromDate, toDate) => {
  const diff = differenceInWeeks(fromDate, toDate);
  return Math.abs(diff) >= 4 ? true : false;
};

export const is8WeeksDifference = (fromDate, toDate) => {
  const diff = differenceInWeeks(fromDate, toDate);
  return Math.abs(diff) >= 8 ? true : false;
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
