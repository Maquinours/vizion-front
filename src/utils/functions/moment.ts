import MONTHS from '../constants/months';

export const getAvailableMonthsForYear = (year: number) => {
  const nowDate = new Date();
  return nowDate.getFullYear() === year ? MONTHS.slice(0, nowDate.getMonth() + 1) : MONTHS;
};
