import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductVersionShelfStockEntriesPageByProductShelfStock } from '../../api/productVersionShelfStockEntry';

export const productVersionShelfStockEntries = createQueryKeys('product-version-shelf-stock-entries', {
  page: {
    queryKey: null,
    contextQueries: {
      byProductShelfStockId: (productShelfStockId: string, { page, size }: { page: number; size: number }) => ({
        queryKey: [productShelfStockId, page, size],
        queryFn: () => getProductVersionShelfStockEntriesPageByProductShelfStock(productShelfStockId, page, size),
      }),
    },
  },
});
