import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfWeek,
  startOfMonth,
  startOfYear,
  formatISO,
  format,
} from "date-fns";

export const isoFormat = (date) =>
  formatISO(date, {
    representation: "date",
  });

export const displayFormat = (date) => format(date, "MMM d yyyy");

export const getToday = () => subDays(new Date(), 0);

export const getYesterday = () => subDays(new Date(), 1);

export const getPastWeek = () => subWeeks(new Date(), 1);

export const getPastMonth = () => subMonths(new Date(), 1);

export const getPastYear = () => subYears(new Date(), 1);

// Week starts on Sunday
export const getBeginningOfWeek = () => startOfWeek(new Date());

export const getBeginningOfMonth = () => startOfMonth(new Date());

export const getBeginningOfYear = () => startOfYear(new Date());
