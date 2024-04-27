import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductVersionById, getProductVersions, getProductVersionsByProductId } from '../../api/productVersion';

export const productVersions = createQueryKeys('product-versions', {
  list: {
    queryKey: null,
    contextQueries: {
      all: {
        queryKey: null,
        queryFn: getProductVersions,
      },
      byProductId: (productId: string) => ({
        queryKey: [productId],
        queryFn: () => getProductVersionsByProductId(productId),
      }),
    },
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getProductVersionById(id),
      }),
    },
  },
});
