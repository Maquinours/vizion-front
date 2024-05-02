import moment, { MomentInput } from 'moment';

export const formatDateWithSlash = (date: MomentInput) => {
  return moment(date).format('DD/MM/YYYY');
};

export const formatDateAndHourWithSlash = (date: MomentInput) => {
  return moment(date).format('DD/MM/YYYY HH:mm');
};

export const formatDateWithHour = (date: MomentInput) => {
  return moment(date).format('DD/MM/YYYY à HH:mm');
};

export const dateToYearMonthDay = (date: MomentInput) => {
  return moment(date).format('YYYY-MM-DD');
};

export const formatDate = (date: MomentInput) => {
  return moment(date).format('DD-MM-YYYY');
};

export const isDateOutdated = (date: MomentInput) => {
  const nowDate = new Date();
  nowDate.setHours(0, 0, 0, 0);
  return moment(date).isBefore(nowDate);
};

export const yearsList = () => {
  const d = new Date('2015');
  const first = d.getFullYear();

  const s = new Date();
  const second = s.getFullYear();

  const arr = [];

  for (let i = first; i <= second; i++) arr.push(i);
  return arr;
};
