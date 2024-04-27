import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllProductFilters, getProductFilterById, getProductFiltersPage } from '../../api/productFilter';

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
  page: {
    queryKey: null,
    contextQueries: {
      all: ({ page, size }: { page: number; size: number }) => ({
        queryKey: [page, size],
        queryFn: () => getProductFiltersPage({ page, size }),
      }),
    },
  },
});
