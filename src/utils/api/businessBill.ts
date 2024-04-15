import { privateInstance } from '../functions/axios';
import BusinessBillRequestDto from '../types/BusinessBillRequestDto';
import BusinessBillResponseDto from '../types/BusinessBillResponseDto';

export const getBusinessBillsByBusinessId = (businessId: string) => {
  return privateInstance<Array<BusinessBillResponseDto>>({
    method: 'GET',
    url: `/business/v1/business/bill/business/${encodeURIComponent(businessId)}`,
  }).then((res) => res.data);
};

export const createBusinessCredit = (data: BusinessBillRequestDto) => {
  return privateInstance<BusinessBillResponseDto>({
    method: 'POST',
    url: '/business/v1/business/bill/add-credit-note',
    data,
  }).then((res) => res.data);
};
