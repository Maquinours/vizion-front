import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllProductShelves } from '../../api/productShelf';

export const productShelves = createQueryKeys('product-shelves', {
  list: {
    queryKey: null,
    queryFn: getAllProductShelves,
  },
});
