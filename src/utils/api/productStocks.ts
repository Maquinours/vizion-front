import { privateInstance } from '../functions/axios';
import ProductStockResponseDto from '../types/ProductStockResponseDto';

export const getAllProductStocks = () => {
  return privateInstance<Array<ProductStockResponseDto>>({
    method: 'GET',
    url: '/product-inventory/v1/product-stock/find-all',
  }).then((res) => res.data);
};

export const getProductStockByProductReference = (productReference: string) => {
  return privateInstance<ProductStockResponseDto>({
    method: 'GET',
    url: `/product-inventory/v1/product-stock/find-by-product/ref/${encodeURIComponent(productReference)}`,
  }).then((res) => res.data);
};
