import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductVersionById, getProductVersions, getProductVersionsByProductId, getProductVersionsPageByProductId } from '../../api/productVersion';

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
  page: {
    queryKey: null,
    contextQueries: {
      byProductId: (productId: string, { page, size }: { page: number; size: number }) => ({
        queryKey: [{ productId, page, size }],
        queryFn: () => getProductVersionsPageByProductId(productId, page, size),
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
