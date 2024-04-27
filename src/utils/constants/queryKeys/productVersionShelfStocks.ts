import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductVersionShelfStockById, getProductVersionShelfStocksPage } from '../../api/productVersionShelfStock';

export const productVersionShelfStocks = createQueryKeys('product-version-shelf-stocks', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getProductVersionShelfStockById(id),
      }),
    },
  },
  page: {
    queryKey: null,
    contextQueries: {
      all: ({ page, size }: { page: number; size: number }) => ({
        queryKey: [page, size],
        queryFn: () => getProductVersionShelfStocksPage({ page, size }),
      }),
    },
  },
});
