import { privateInstance } from '../functions/axios';
import BusinessQuotationDetailsRequestDto from '../types/BusinessQuotationDetailsRequestDto';
import BusinessQuotationDetailsResponseDto from '../types/BusinessQuotationDetailsResponseDto';
import QuotationDetailRequestDto from '../types/QuotationDetailRequestDto';

export const createBusinessQuotationDetail = (data: BusinessQuotationDetailsRequestDto) => {
  return privateInstance<BusinessQuotationDetailsResponseDto>({
    method: 'POST',
    url: '/business/v1/business/quotation/details/add',
    data,
  }).then((res) => res.data);
};

export const getBusinessQuotationDetailById = (id: string) => {
  return privateInstance<BusinessQuotationDetailsResponseDto>({
    method: 'GET',
    url: `/business/v1/business/quotation/details/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateBusinessQuotationDetail = (id: string, data: BusinessQuotationDetailsRequestDto) => {
  return privateInstance<BusinessQuotationDetailsResponseDto>({
    method: 'PUT',
    url: `/business/v1/business/quotation/details/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteBusinessQuotationDetail = (id: string, info: QuotationDetailRequestDto) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/business/v1/business/quotation/details/${encodeURIComponent(id)}`,
    data: info,
  }).then((res) => res.data);
};
