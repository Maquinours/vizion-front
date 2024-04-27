import { privateInstance } from '../functions/axios';
import BusinessBpRequestDto from '../types/BusinessBpRequestDto';
import BusinessBpResponseDto from '../types/BusinessBpResponseDto';

export const createBusinessBp = (data: BusinessBpRequestDto) => {
  return privateInstance<BusinessBpResponseDto>({
    method: 'POST',
    url: '/business/v1/business/bp/add',
    data,
  }).then((res) => res.data);
};

export const getBusinessBpByBusinessId = (businessId: string) => {
  return privateInstance<BusinessBpResponseDto>({
    method: 'GET',
    url: `/business/v1/business/bp/business/${encodeURIComponent(businessId)}`,
  }).then((res) => res.data);
};
