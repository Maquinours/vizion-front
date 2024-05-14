import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductStockEntryResponseDto from '../types/ProductStockEntryResponseDto';

export const getProductStockEntriesPageByProductId = async (productId: string, page: number, size: number) => {
  return privateInstance<Page<ProductStockEntryResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/product-stock-entry/by-product-id/${encodeURIComponent(productId)}/page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};
