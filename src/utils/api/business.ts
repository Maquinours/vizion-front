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

export const getBusinessByInfos = ({
  serialNumber,
  businessNumber,
  orderNumber,
}: {
  serialNumber: string | undefined;
  businessNumber: string | undefined;
  orderNumber: string | undefined;
}) => {
  return privateInstance<BusinessResponseDto>({
    method: 'GET',
    url: `/business/v1/business/find-business-for-credit`,
    params: {
      numBusiness: businessNumber,
      numOrder: orderNumber,
      numSerie: serialNumber,
    },
  }).then((res) => res.data);
};

export const archiveBusiness = (businessId: string) => {
  return privateInstance<BusinessResponseDto>({
    method: 'POST',
    url: `/business/v1/business/archive`,
    params: {
      businessId,
    },
  }).then((res) => res.data);
};
