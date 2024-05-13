import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getMailById, getMailsPage, getMailsPageWithSearch } from '../../api/mails';

export const mailQueryKeys = createQueryKeys('mails', {
  page: {
    queryKey: null,
    contextQueries: {
      all: ({ page, size }: { page: number; size: number }, searchText?: string) => ({
        queryKey: [page, size, searchText],
        queryFn: () => (searchText ? getMailsPageWithSearch(searchText, { page, size }) : getMailsPage({ page, size })),
      }),
    },
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getMailById(id),
      }),
    },
  },
});
