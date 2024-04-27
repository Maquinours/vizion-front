import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductVersionStocksByProductId } from '../../api/productVersionStocks';

export const productVersionStocks = createQueryKeys('product-version-stocks', {
  list: {
    queryKey: null,
    contextQueries: {
      byProductId: (productId: string) => ({
        queryKey: [productId],
        queryFn: () => getProductVersionStocksByProductId(productId),
      }),
    },
  },
});
