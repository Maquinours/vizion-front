import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getFormationById, getFormationsPage } from '../../api/formations';

export const formations = createQueryKeys('formations', {
  page: ({ page, size }: { page: number; size: number }) => ({
    queryKey: [page, size],
    queryFn: () => getFormationsPage({ page, size }),
  }),
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getFormationById(id),
      }),
    },
  },
});
