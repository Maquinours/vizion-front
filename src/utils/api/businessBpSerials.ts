import { privateInstance } from '../functions/axios';
import BusinessBpSerialRequestDto from '../types/BusinessBpSerialRequestDto';
import BusinessBpSerialResponseDto from '../types/BusinessBpSerialResponseDto';

export const createBpSerial = async (data: BusinessBpSerialRequestDto) => {
  return privateInstance<BusinessBpSerialResponseDto>({
    method: 'POST',
    url: '/business/v1/business/bp/serial/add',
    data,
  }).then((res) => res.data);
};

export const getBusinessBpSerialById = (id: string) => {
  return privateInstance<BusinessBpSerialResponseDto>({
    method: 'GET',
    url: `/business/v1/business/bp/serial/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const deleteBusinessBpSerial = (data: BusinessBpSerialRequestDto) => {
  return privateInstance<BusinessBpSerialResponseDto>({
    method: 'POST',
    url: '/business/v1/business/bp/serial/remove',
    data: data,
  }).then((res) => res.data);
};
