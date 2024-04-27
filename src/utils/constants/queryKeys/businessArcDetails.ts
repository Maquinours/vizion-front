import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessArcDetailById } from '../../api/businessArcDetails';

export const businessArcDetails = createQueryKeys('business-arc-details', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getBusinessArcDetailById(id),
      }),
    },
  },
});
