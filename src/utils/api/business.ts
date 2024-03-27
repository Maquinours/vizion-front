import { privateInstance } from '../functions/axios';
import BusinessRequestDto from '../types/BusinessRequestDto';
import BusinessResponseDto from '../types/BusinessResponseDto';

export const createBusiness = async (business: BusinessRequestDto) => {
  return (
    await privateInstance<BusinessResponseDto>({
      method: 'POST',
      url: '/business/v1/business/add',
      data: business,
    })
  ).data;
};

export const getBusinessById = async (businessId: string) => {
  return (
    await privateInstance<BusinessResponseDto>({
      method: 'GET',
      url: `/business/v1/business/${encodeURIComponent(businessId)}`,
    })
  ).data;
};