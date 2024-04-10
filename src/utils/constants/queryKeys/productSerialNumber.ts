import { createQueryKeys } from '@lukemorales/query-key-factory';
import {
  getProductSerialNumberById,
  getProductSerialNumbersPage,
  getProductSerialNumbersPageWithSearch,
  getSerialNumberDataByNumberAndCategory,
} from '../../api/productSerialNumber';

export const productSerialNumbers = createQueryKeys('product-serial-numbers', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [{ page, size }],
    contextQueries: {
      search: (searchText: string | undefined) => ({
        queryKey: [searchText],
        queryFn: () => (searchText ? getProductSerialNumbersPageWithSearch(searchText, page, size) : getProductSerialNumbersPage(page, size)),
      }),
    },
  }),
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getProductSerialNumberById(id),
      }),
    },
  },
  data: {
    queryKey: null,
    contextQueries: {
      byCategoryAndNumber: (category: string, number: string) => ({
        queryKey: [category, number],
        queryFn: () => getSerialNumberDataByNumberAndCategory(number, category),
      }),
    },
  },
});
