import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllProductStocks, getProductStockByProductReference } from '../../api/productStocks';

export const productStocks = createQueryKeys('product-stocks', {
  list: {
    queryKey: null,
    contextQueries: {
      all: {
        queryKey: null,
        queryFn: getAllProductStocks,
      },
    },
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byProductReference: (productReference: string) => ({
        queryKey: [productReference],
        queryFn: () => getProductStockByProductReference(productReference),
      }),
    },
  },
});
