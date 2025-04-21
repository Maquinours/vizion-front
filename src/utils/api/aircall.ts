import moment from 'moment';
import { aircallInstance } from '../functions/axios';
import AircallCallsResponseDto from '../types/AircallCallsResponseDto';
import AircallUsersResponseDto from '../types/AircallUsersResponseDto';

export const getAllAircallUsers = async () => {
  return aircallInstance<AircallUsersResponseDto>({ method: 'GET', url: '/users' }).then((res) => res.data);
};

export const getAllAircallCalls = async () => {
  return aircallInstance<AircallCallsResponseDto>({ method: 'GET', url: `/calls`, params: { order: 'desc', per_page: 100 } }).then((res) => res.data);
};

export const getAircallCallsByDates = async ({ from, to }: { from: Date; to: Date }) => {
  return aircallInstance<AircallCallsResponseDto>({
    method: 'GET',
    url: `/calls`,
    params: { order: 'desc', per_page: 100, from: moment(from).unix().toString(), to: moment(to).unix().toString() },
  }).then((res) => res.data);
};

export const searchAircallCalls = async ({ from, to, phoneNumber, page }: { from?: Date; to?: Date; phoneNumber?: string; page: number }) => {
  const params: { order: 'desc'; per_page: 50; page: number; from?: string; to?: string; phone_number?: string } = {
    order: 'desc',
    per_page: 50,
    page,
  };

  if (from && to) {
    params.from = moment(from).unix().toString();
    params.to = moment(to).unix().toString();
  }
  if (phoneNumber) params.phone_number = phoneNumber;

  return aircallInstance<AircallCallsResponseDto>({
    method: 'GET',
    url: `/calls/search`,
    params,
  }).then((res) => res.data);
};
