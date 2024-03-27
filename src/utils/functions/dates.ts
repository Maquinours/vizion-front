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
