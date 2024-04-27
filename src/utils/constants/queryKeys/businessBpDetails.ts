import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessBpDetailById } from '../../api/businessBpDetails';

export const businessBpDetails = createQueryKeys('business-bp-details', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getBusinessBpDetailById(id),
      }),
    },
  },
});
