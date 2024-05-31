import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getRmaSupportDetailById } from '../../api/rmaSupportDetail';

export const rmaSupportDetailQueryKeys = createQueryKeys('rma-support-details', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id) => ({
        queryKey: [id],
        queryFn: () => getRmaSupportDetailById(id),
      }),
    },
  },
});
