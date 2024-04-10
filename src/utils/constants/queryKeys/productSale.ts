import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductSalesByProductId, getProductSalesByProductIdAndSearch } from '../../api/productSale';

export const productSales = createQueryKeys('product-sale', {
  detail: {
    queryKey: null,
    contextQueries: {
      byProductIdAndSearch: ({
        productId,
        contact,
        startDate,
        endDate,
        page,
        size,
      }: {
        productId: string;
        contact: string | undefined;
        startDate: Date | undefined;
        endDate: Date | undefined;
        page: number;
        size: number;
      }) => ({
        queryKey: [productId, contact, startDate, endDate, page, size],
        queryFn: () =>
          !!contact || !!startDate || !!endDate
            ? getProductSalesByProductIdAndSearch(productId, contact, startDate, endDate, page, size)
            : getProductSalesByProductId(productId, page, size),
      }),
    },
  },
});
