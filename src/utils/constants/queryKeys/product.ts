import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  getAssociatedProductsPage,
  getNotAssociatedProducts,
  getProductById,
  getProducts,
  getProductsPage,
  getProductsPageWithSearch,
} from '../../api/product';

export const products = createQueryKeys('product', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getProductById(id),
      }),
    },
  },
  list: {
    queryKey: null,
    queryFn: getProducts,
    contextQueries: {
      byNotAssociatedProductId: (notAssociatedProductId: string) => ({
        queryKey: [notAssociatedProductId],
        queryFn: () => getNotAssociatedProducts(notAssociatedProductId),
      }),
    },
  },
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    contextQueries: {
      search: ({ ref, designation }: { ref: string | undefined; designation: string | undefined }) => ({
        queryKey: [ref, designation],
        queryFn: () => (ref || designation ? getProductsPageWithSearch(ref, designation, page, size) : getProductsPage(page, size)),
      }),
      byAssociatedProductId: (associatedProductId: string) => ({
        queryKey: [associatedProductId],
        queryFn: () => getAssociatedProductsPage(associatedProductId, page, size),
      }),
    },
  }),
});
