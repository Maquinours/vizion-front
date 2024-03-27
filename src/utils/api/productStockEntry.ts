import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductStockEntryResponseDto from '../types/ProductStockEntryResponseDto';

export const getProductStockEntriesPageByProductId = async (productId: string, page: number, size: number) => {
  // TODO: change API to handle productId instead of product stock Id. Should not work for now.
  return privateInstance<Page<ProductStockEntryResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/product-stock-entry/find-by-product-id/page/${encodeURIComponent(productId)}/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};
