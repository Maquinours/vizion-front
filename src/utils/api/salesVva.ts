import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import SalesVvaRequestDto from '../types/SalesVvaRequestDto';
import SalesVvaResponseDto from '../types/SalesVvaResponseDto';

export const getSalesVvaPage = (page: number, size: number) => {
  return privateInstance<Page<SalesVvaResponseDto>>({
    method: 'GET',
    url: `/business/v1/business/sales-and-vva/all/page`,
    params: {
      page,
      size,
    },
  }).then((res) => res.data);
};

export const createMultipleSalesVva = (data: Array<SalesVvaRequestDto>) => {
  return privateInstance<Array<SalesVvaResponseDto>>({
    method: 'POST',
    url: '/business/v1/business/sales-and-vva/store-all',
    data: { salesAndVVADtoList: data },
  }).then((res) => res.data);
};

export const deleteSaleVva = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/business/v1/business/sales-and-vva/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getSaleVvaById = (id: string) => {
  return privateInstance<SalesVvaResponseDto>({
    method: 'GET',
    url: `/business/v1/business/sales-and-vva/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getSalesVvaByDepartmentCodesYearAndMonth = ({ repCodes, representativeId, year, month }: { repCodes?: Array<string> | null; representativeId?: string | null; year: number; month: number }) => {
  return privateInstance<Array<SalesVvaResponseDto>>({
    method: 'GET',
    url: `/business/v1/business/sales-and-vva/sales`,
    params: {
      repCodes,
      representativeId,
      year,
      month,
    },
  }).then((res) => res.data);
};

export const getSalesVvaExcelByDepartmentCodesYearAndMonth = ({ repCodes, year, month }: { repCodes: Array<string>; year: number; month: number }) => {
  return privateInstance<Blob>({
    method: 'GET',
    url: `/business/v1/business/sales-and-vva/download-representative`,
    params: {
      repCodes,
      year,
      month,
    },
    responseType: 'blob',
  }).then((res) => res.data);
};
