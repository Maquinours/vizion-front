import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductStockEntriesPageByProductId } from '../../api/productStockEntry';

export const productStockEntriesQueryKeys = createQueryKeys('product-stock-entries', {
  page: {
    queryKey: null,
    contextQueries: {
      byProductId: (productId: string, { page, size }: { page: number; size: number }) => ({
        queryKey: [{ productId, page, size }],
        queryFn: () => getProductStockEntriesPageByProductId(productId, page, size),
      }),
    },
  },
});
