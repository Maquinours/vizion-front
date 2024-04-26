import { privateInstance } from '../functions/axios';
import BusinessBlRequestDto from '../types/BusinessBlRequestDto';
import BusinessBlResponseDto from '../types/BusinessBlResponseDto';

export const createBusinessBl = (data: BusinessBlRequestDto) => {
  return privateInstance<BusinessBlResponseDto>({
    method: 'POST',
    url: '/business/v1/business/bl/add',
    data,
  }).then((res) => res.data);
};
