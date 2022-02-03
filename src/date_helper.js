import {
  subDays,
  subWeeks,
  subMonths,
  subYears,
  startOfWeek,
  startOfMonth,
  startOfYear,
  formatISO,
} from "date-fns";

const format = (date) =>
  formatISO(date, {
    representation: "date",
  });

export const getToday = () => {
  const today = subDays(new Date(), 0);
  return format(today);
};

export const getYesterday = () => {
  const yesterday = subDays(new Date(), 1);
  return format(yesterday);
};

export const getWeekBack = () => {
  const weekBack = subWeeks(new Date(), 1);
  return format(weekBack);
};

export const getMonthBack = () => {
  const monthBack = subMonths(new Date(), 1);
  return format(monthBack);
};

export const getYearBack = () => {
  const yearBack = subYears(new Date(), 1);
  return format(yearBack);
};

export const getBeginningOfWeek = () => {
  // Week starts on Sunday
  const beginning = startOfWeek(new Date());
  return format(beginning);
};

export const getBeginningOfMonth = () => {
  const beginning = startOfMonth(new Date());
  return format(beginning);
};
export const getBeginningOfYear = () => {
  const beginning = startOfYear(new Date());
  return format(beginning);
};
