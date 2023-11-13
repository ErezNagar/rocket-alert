import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  formatISO,
  format,
  differenceInWeeks,
} from "date-fns";
import { utcToZonedTime, zonedTimeToUtc } from "date-fns-tz";

export const convertToLocalTime = (date) =>
  zonedTimeToUtc(date, "Asia/Jerusalem");

export const convertToServerTime = (date) =>
  utcToZonedTime(date, "Asia/Jerusalem");

export const isoFormat = (date) =>
  formatISO(date, {
    representation: "date",
  });

export const displayFormat = (date) => format(date, "MMM d, yyyy");

export const alertTimeDisplayFormat = (date) => format(date, "HH:mm");

export const dayOfMonthFormat = (date) => format(date, "M/d");

export const isWeekDifference = (fromDate, toDate) => {
  const diff = differenceInWeeks(fromDate, toDate);
  return Math.abs(diff) === 1 ? true : false;
};

export const weekRangeFormat = (fromDate, toDate) =>
  `${dayOfMonthFormat(fromDate)} - ${dayOfMonthFormat(subDays(toDate, 1))}`;

export const getToday = () => new Date();

export const getYesterday = () => subDays(new Date(), 1);

export const getPastWeek = () => subWeeks(new Date(), 1);

export const getPastMonth = () => subMonths(new Date(), 1);

export const getPastYear = () => subYears(new Date(), 1);
