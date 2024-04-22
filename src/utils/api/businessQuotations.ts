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
