import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getFaqById, getFaqsPageByArchiveState, getFaqsPageByArchiveStateWithSearch } from '../../api/faq';

export const faqs = createQueryKeys('faq', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    contextQueries: {
      byArchiveStateAndSearch: (archived: boolean, searchText: string | undefined, fuzzy: boolean) => ({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [archived, searchText, fuzzy],
        queryFn: () =>
          searchText ? getFaqsPageByArchiveStateWithSearch(archived, searchText, fuzzy, page, size) : getFaqsPageByArchiveState(archived, page, size),
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
