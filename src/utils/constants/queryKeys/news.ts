import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getNewsById, getNewsPage } from '../../api/news';

export const news = createQueryKeys('news', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getNewsPage(page, size),
  }),
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getNewsById(id),
      }),
    },
  },
});
