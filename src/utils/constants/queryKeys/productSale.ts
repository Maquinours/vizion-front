import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProductSalesByProductRef, getProductSalesByProductRefAndSearch } from '../../api/productSale';

export const productSales = createQueryKeys('product-sale', {
  detail: {
    queryKey: null,
    contextQueries: {
      byProductRefAndSearch: ({
        productRef,
        contact,
        startDate,
        endDate,
        page,
        size,
      }: {
        productRef: string;
        contact: string | undefined;
        startDate: Date | undefined;
        endDate: Date | undefined;
        page: number;
        size: number;
      }) => ({
        queryKey: [productRef, contact, startDate, endDate, page, size],
        queryFn: () =>
          !!contact || !!startDate || !!endDate
            ? getProductSalesByProductRefAndSearch(productRef, contact, startDate, endDate, page, size)
            : getProductSalesByProductRef(productRef, page, size),
      }),
    },
  },
});
