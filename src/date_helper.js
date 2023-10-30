import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  formatISO,
  format,
} from "date-fns";
import { utcToZonedTime } from "date-fns-tz";

const convertToServerTime = (date) => utcToZonedTime(date, "Asia/Jerusalem");

export const isoFormat = (date) =>
  formatISO(date, {
    representation: "date",
  });

export const displayFormat = (date) => format(date, "MMM d, yyyy");

export const getToday = () => convertToServerTime(new Date());

export const getYesterday = () => convertToServerTime(subDays(new Date(), 1));

export const getPastWeek = () => convertToServerTime(subWeeks(new Date(), 1));

export const getPastMonth = () => convertToServerTime(subMonths(new Date(), 1));

export const getPastYear = () => convertToServerTime(subYears(new Date(), 1));
