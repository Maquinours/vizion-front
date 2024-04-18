import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  getAssociatedProductsPage,
  getNotAssociatedProducts,
  getProductById,
  getProducts,
  getProductsPage,
  getProductsPageWithSearch,
} from '../../api/product';
import { getProductSpecificationById, getProductSpecificationsPageByProductId } from '../../api/productSpecification';
import { getProductStockEntriesPageByProductId } from '../../api/productStockEntry';
import { getProductVersionsByProductId, getProductVersionsPageByProductId } from '../../api/productVersion';
import { getProductVersionShelfStocksPageByProductId } from '../../api/productVersionShelfStock';

const products = createQueryKeys('product', {
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getProductById(id),
    contextQueries: {
      specifications: {
        queryKey: null,
        contextQueries: {
          page: ({ page, size }: { page: number; size: number }) => ({
            queryKey: [page, size],
            queryFn: () => getProductSpecificationsPageByProductId(id, page, size),
          }),
          detail: (specificationId: string) => ({
            queryKey: [specificationId],
            queryFn: () => getProductSpecificationById(id, specificationId),
          }),
        },
      },
      stockEntries: {
        queryKey: null,
        contextQueries: {
          page: ({ page, size }: { page: number; size: number }) => ({
            queryKey: [page, size],
            queryFn: () => getProductStockEntriesPageByProductId(id, page, size),
          }),
        },
      },
      versions: {
        queryKey: null,
        contextQueries: {
          list: {
            queryKey: null,
            queryFn: () => getProductVersionsByProductId(id),
          },
          page: ({ page, size }) => ({
            queryKey: [page, size],
            queryFn: () => getProductVersionsPageByProductId(id, page, size),
          }),
        },
      },
      versionShelfStocks: {
        queryKey: null,
        contextQueries: {
          page: ({ page, size }: { page: number; size: number }) => ({
            queryKey: [page, size],
            queryFn: () => getProductVersionShelfStocksPageByProductId(id, page, size),
          }),
        },
      },
    },
  }),
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

export default products;
