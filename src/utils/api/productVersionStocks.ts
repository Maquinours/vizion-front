import { privateInstance } from '../functions/axios';
import ProductVersionStockResponseDto from '../types/ProductVersionStockResponseDto';

export const getProductVersionStocksByProductId = async (productId: string) => {
  return privateInstance<Array<ProductVersionStockResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/product-version-stock/find-by-product`,
    params: {
      productId,
    },
  }).then((res) => res.data);
};
