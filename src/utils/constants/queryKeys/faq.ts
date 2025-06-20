import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getFaqById, getFaqsPageByArchiveStateWithSearch } from '../../api/faq';
import FaqAccessLevel from '../../enums/FaqAccessLevel';

export const faqs = createQueryKeys('faq', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    contextQueries: {
      byArchiveStateAndSearch: (
        archived: boolean,
        searchText: string | undefined,
        productId: string | undefined,
        accessLevel: FaqAccessLevel | undefined,
        fuzzy: boolean,
      ) => ({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [archived, searchText, fuzzy],
        queryFn: () => getFaqsPageByArchiveStateWithSearch(archived, searchText, productId, accessLevel, fuzzy, page, size),
      }),
    },
  }),
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getFaqById(id),
      }),
    },
  },
});
