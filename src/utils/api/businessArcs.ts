import { privateInstance } from '../functions/axios';
import BusinessArcRequestDto from '../types/BusinessArcRequestDto';
import BusinessArcResponseDto from '../types/BusinessArcResponseDto';

export const createBusinessArc = (data: BusinessArcRequestDto) => {
  return privateInstance<BusinessArcResponseDto>({
    method: 'POST',
    url: '/business/v1/business/arc/add',
    data,
  }).then((res) => res.data);
};

export const getBusinessArcByBusinessId = (businessId: string) => {
  return privateInstance<BusinessArcResponseDto>({
    method: 'GET',
    url: `/business/v1/business/arc/business/${encodeURIComponent(businessId)}`,
  }).then((res) => res.data);
};

export const updateBusinessArc = async (id: string, data: BusinessArcRequestDto) => {
  return privateInstance<BusinessArcResponseDto>({
    method: 'PUT',
    url: `/business/v1/business/arc/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
