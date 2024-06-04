import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getRmaReceptionDetailById } from '../../api/rmaReceptionDetail';

export const rmaReceptionDetailQueryKey = createQueryKeys('rma-reception-details', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getRmaReceptionDetailById(id),
      }),
    },
  },
});
