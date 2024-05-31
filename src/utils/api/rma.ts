import CategoryBusiness from '../enums/CategoryBusiness';
import { privateInstance } from '../functions/axios';
import AssistanceRequestDto from '../types/AssistanceRequestDto';
import AssistanceResponseDto from '../types/AssistanceResponseDto';

export const getRmaById = async (id: string) => {
  return (
    await privateInstance<AssistanceResponseDto>({
      method: 'GET',
      url: `/rma/v1/assistance/${encodeURIComponent(id)}`,
    })
  ).data;
};

export const createRma = async (data: AssistanceRequestDto) => {
  return (
    await privateInstance<AssistanceResponseDto>({
      method: 'POST',
      url: '/rma/v1/assistance/',
      data,
    })
  ).data;
};

export const createRmaFromBusiness = async (category: CategoryBusiness, number: string, serialNumbers: Array<string>) => {
  return privateInstance<AssistanceResponseDto>({
    method: 'POST',
    url: '/rma/v1/assistance/from-old-business',
    params: {
      category,
      number,
      serialNumbers,
    },
  }).then((res) => res.data);
};

export const archiveRma = async (id: string) => {
  return privateInstance<AssistanceResponseDto>({
    method: 'POST',
    url: `/rma/v1/assistance/archive/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateRma = (id: string, data: AssistanceRequestDto) => {
  return privateInstance<AssistanceResponseDto>({
    method: 'PUT',
    url: `/rma/v1/assistance/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
