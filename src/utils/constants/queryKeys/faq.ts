import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getFaqById, getFaqsPageByArchiveState, getFaqsPageByArchiveStateWithSearch } from '../../api/faq';

export const faqs = createQueryKeys('faq', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    contextQueries: {
      byArchiveStateAndSearch: (archived: boolean, searchText: string | undefined) => ({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [archived, searchText],
        queryFn: () => (searchText ? getFaqsPageByArchiveStateWithSearch(archived, searchText, page, size) : getFaqsPageByArchiveState(archived, page, size)),
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
