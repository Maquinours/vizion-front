import moment from 'moment';
import { aircallInstance } from '../functions/axios';
import AircallCallsResponseDto from '../types/AircallCallsResponseDto';
import AircallUsersResponseDto from '../types/AircallUsersResponseDto';
import AircallCreateContactResponseDto from '../types/AircallCreateContactRequestDto';
import AircallContactResponseDto from '../types/AircallContactResponseDto';
import AircallUpdateContactRequestDto from '../types/AircallUpdateContactRequestDto';
import AircallAvailabilitiesResponseDto from '../types/AircallAvailabilitiesResponseDto';

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

export const searchAircallCalls = async ({
  from,
  to,
  phoneNumber,
  page,
  fetchContact,
}: {
  from?: Date;
  to?: Date;
  phoneNumber?: string;
  page: number;
  fetchContact: boolean;
}) => {
  const params: { order: 'desc'; per_page: 50; page: number; from?: string; to?: string; phone_number?: string; fetch_contact?: boolean } = {
    order: 'desc',
    per_page: 50,
    page,
    fetch_contact: fetchContact,
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

export const createAircallContact = async (data: AircallCreateContactResponseDto) => {
  return aircallInstance<{ contact: AircallContactResponseDto }>({ method: 'POST', url: `/contacts`, data }).then((res) => res.data);
};

export const updateAircallContact = async (id: number, data: AircallUpdateContactRequestDto) => {
  return aircallInstance<{ contact: AircallContactResponseDto }>({ method: 'POST', url: `/contacts/${id}`, data }).then((res) => res.data);
};

export const getAircallContactById = async (id: number) => {
  return aircallInstance<{ contact: AircallContactResponseDto }>({ method: 'GET', url: `/contacts/${id}` }).then((res) => res.data);
};

export const getAircallAvailabilities = async () => {
  return aircallInstance<AircallAvailabilitiesResponseDto>({
    method: 'GET',
    url: `/users/availabilities`,
  }).then((res) => res.data);
};
