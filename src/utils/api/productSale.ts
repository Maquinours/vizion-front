import { privateInstance } from '../functions/axios';
import BpProductInfoResResponseDto from '../types/BpProductInfoResResponseDto';

export const getProductSalesByProductId = (productId: string, page: number, size: number) => {
  return privateInstance<BpProductInfoResResponseDto>({
    method: 'GET',
    url: `/business/v1/business/product-sell-history`,
    params: {
      productId,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getProductSalesByProductIdAndSearch = (
  productId: string,
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
      productId,
      startDate,
      endDate,
      contact,
      page,
      size,
    },
  }).then((res) => res.data);
};
