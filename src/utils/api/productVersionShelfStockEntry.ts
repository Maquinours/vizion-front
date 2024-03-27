import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import ProductVersionShelfStockEntryResponseDto from '../types/ProductVersionShelfStockEntryResponseDto';

export const getProductVersionShelfStockEntriesPageByProductShelfStock = (productVersionShelfStockId: string, page: number, size: number) => {
  return privateInstance<Page<ProductVersionShelfStockEntryResponseDto>>({
    method: 'GET',
    url: `/product-inventory/v1/product-version-shelf-stock-entry/find-all-by-product-version-stock-id-paged/${encodeURIComponent(
      page,
    )}/${encodeURIComponent(size)}`,
    params: {
      productVersionShelfStockId,
    },
  }).then((res) => res.data);
};
