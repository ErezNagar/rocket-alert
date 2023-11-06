import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  formatISO,
  format,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

export const convertToServerTime = (date) =>
  utcToZonedTime(date, "Asia/Jerusalem");

export const isoFormat = (date) =>
  formatISO(date, {
    representation: "date",
  });

export const displayFormat = (date) => format(date, "MMM d, yyyy");

export const getToday = () => new Date();

export const getYesterday = () => subDays(new Date(), 1);

export const getPastWeek = () => subWeeks(new Date(), 1);

export const getPastMonth = () => subMonths(new Date(), 1);

export const getPastYear = () => subYears(new Date(), 1);
