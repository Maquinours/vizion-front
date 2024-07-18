import { privateInstance } from '../functions/axios';
import BusinessSubQuotationRequestDto from '../types/BusinessSubQuotationRequestDto';
import BusinessSubQuotationResponseDto from '../types/BusinessSubQuotationResponseDto';
import QuotationDetailRequestDto from '../types/QuotationDetailRequestDto';

export const createBusinessSubQuotation = (data: BusinessSubQuotationRequestDto) => {
  return privateInstance<BusinessSubQuotationResponseDto>({
    method: 'POST',
    url: '/business/v1/business/sub-quotation/add',
    data,
  }).then((res) => res.data);
};

export const reorderBusinessSubQuotation = ({ id, orderNum }: { id: string; orderNum: number }) => {
  return privateInstance<void>({
    method: 'PUT',
    url: `/business/v1/business/sub-quotation/reorder/${id}`,
    data: {
      orderNum,
    },
  }).then((res) => res.data);
};

export const getBusinessSubQuotationById = (id: string) => {
  return privateInstance<BusinessSubQuotationResponseDto>({
    method: 'GET',
    url: `/business/v1/business/sub-quotation/${id}`,
  }).then((res) => res.data);
};

export const updateBusinessSubQuotation = (id: string, data: BusinessSubQuotationRequestDto) => {
  return privateInstance<BusinessSubQuotationResponseDto>({
    method: 'PUT',
    url: `/business/v1/business/sub-quotation/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteBusinessSubQuotation = async (id: string, data: QuotationDetailRequestDto) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/business/v1/business/sub-quotation/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
