import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getRmaDeliveryDetailById } from '../../api/rmaDeliveryDetail';

export const rmaDeliveryDetailQueryKeys = createQueryKeys('rma-deliver-details', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getRmaDeliveryDetailById(id),
      }),
    },
  },
});
