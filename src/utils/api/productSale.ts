import { privateInstance } from '../functions/axios';
import BpProductInfoResResponseDto from '../types/BpProductInfoResResponseDto';

export const getProductSalesByProductRef = (productRef: string, page: number, size: number) => {
  return privateInstance<BpProductInfoResResponseDto>({
    method: 'GET',
    url: `/business/v1/business/product-sell-history`,
    params: {
      productRef,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getProductSalesByProductRefAndSearch = (
  productRef: string,
  contact: string | undefined,
  startDate: Date | undefined,
  endDate: Date | undefined,
  page: number,
  size: number,
) => {
  return privateInstance<BpProductInfoResResponseDto>({
    method: 'GET',
    url: `/business/v1/business/product-sell-history-between-and-enterprise`,
    params: {
      productRef,
      startDate,
      endDate,
      contact,
      page,
      size,
    },
  }).then((res) => res.data);
};
