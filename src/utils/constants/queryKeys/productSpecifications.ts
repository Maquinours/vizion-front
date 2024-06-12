import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductSpecificationById, getProductSpecificationsPageByProductId } from '../../api/productSpecification';

export const productSpecificationsQueryKeys = createQueryKeys('product-specifications', {
  page: {
    queryKey: null,
    contextQueries: {
      byProductId: (productId: string, { page, size }: { page: number; size: number }) => ({
        queryKey: [{ productId, page, size }],
        queryFn: () => getProductSpecificationsPageByProductId(productId, page, size),
      }),
    },
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byId: ({ productId, specificationId }: { productId: string; specificationId: string }) => ({
        queryKey: [{ productId, specificationId }],
        queryFn: () => getProductSpecificationById(productId, specificationId),
      }),
    },
  },
});
