import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllProductStocks } from '../../api/productStocks';

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
});
