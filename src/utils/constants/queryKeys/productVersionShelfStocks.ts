import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  getProductVersionShelfStockById,
  getProductVersionShelfStocksPage,
  getProductVersionShelfStocksPageByProductReference,
} from '../../api/productVersionShelfStock';

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
      all: ({ productVersionId, shelfId }: { productVersionId?: string; shelfId?: string }, { page, size }: { page: number; size: number }) => ({
        queryKey: [
          { productVersionId, shelfId },
          { page, size },
        ],
        queryFn: () => getProductVersionShelfStocksPage({ productVersionId, shelfId }, { page, size }),
      }),
      byProductReference: (reference: string, { page, size }: { page: number; size: number }) => ({
        queryKey: [{ reference, page, size }],
        queryFn: () => getProductVersionShelfStocksPageByProductReference(reference, { page, size }),
      }),
    },
  },
});
