import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllProductFilters, getProductFilterById } from '../../api/productFilter';

export const productFilters = createQueryKeys('product-filter', {
  list: {
    queryKey: null,
    queryFn: getAllProductFilters,
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getProductFilterById(id),
      }),
    },
  },
});
