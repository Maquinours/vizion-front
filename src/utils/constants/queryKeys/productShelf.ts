import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllProductShelves, getProductShelfById, getProductShelvesPage } from '../../api/productShelf';

export const productShelves = createQueryKeys('product-shelves', {
  list: {
    queryKey: null,
    queryFn: getAllProductShelves,
  },
  page: {
    queryKey: null,
    contextQueries: {
      all: ({ page, size }: { page: number; size: number }) => ({
        queryKey: [page, size],
        queryFn: () => getProductShelvesPage({ page, size }),
      }),
    },
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getProductShelfById(id),
      }),
    },
  },
});
