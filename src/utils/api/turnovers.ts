import { privateInstance } from '../functions/axios';
import SaleDataRowResponseDto from '../types/SaleDataRowResponseDto';

export const getExcelTurnoversByYear = (year: number) => {
  return privateInstance<Blob>({
    method: 'GET',
    url: `/business/v1/business/sales-and-vva/download-ca-group-by-year`,
    params: {
      year,
    },
    responseType: 'blob',
  }).then((res) => res.data);
};

export const getTurnoversByYear = (year: number) => {
  return privateInstance<Record<string, SaleDataRowResponseDto>>({
    method: 'GET',
    url: `/business/v1/business/sales-and-vva/ca-group-by-year`,
    params: {
      year,
    },
  }).then((res) => res.data);
};
