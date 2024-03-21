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
