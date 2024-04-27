import { privateInstance } from '../functions/axios';
import BusinessQuotationRequestDto from '../types/BusinessQuotationRequestDto';
import BusinessQuotationResponseDto from '../types/BusinessQuotationResponseDto';
import BusinessResponseDto from '../types/BusinessResponseDto';

export const createBusinessQuotation = (data: BusinessQuotationRequestDto) => {
  return privateInstance<BusinessQuotationResponseDto>({
    method: 'POST',
    url: '/business/v1/business/quotation/add',
    data,
  }).then((res) => res.data);
};

export const importBusinessQuotation = ({ business, otherBusiness }: { business: BusinessResponseDto; otherBusiness: BusinessResponseDto }) => {
  return privateInstance<BusinessQuotationResponseDto>({
    method: 'POST',
    url: `/business/v1/business/quotation/add-from`,
    params: {
      businessId: business.id,
      fromId: otherBusiness.id,
    },
  }).then((res) => res.data);
};

export const getBusinessQuotationByBusinessId = (businessId: string) => {
  return privateInstance<BusinessQuotationResponseDto>({
    method: 'GET',
    url: `/business/v1/business/quotation/business/${encodeURIComponent(businessId)}`,
  }).then((res) => res.data);
};

export const updateBusinessQuotation = (id: string, data: BusinessQuotationRequestDto) => {
  return privateInstance<BusinessQuotationResponseDto>({
    method: 'PUT',
    url: `/business/v1/business/quotation/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
