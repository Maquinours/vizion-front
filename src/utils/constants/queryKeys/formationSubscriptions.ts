import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getFormationSubscriptionById, getFormationSubscriptionsByFormationDetailId } from '../../api/formationSubscriptions';

export const formationSubscriptions = createQueryKeys('formation-subscriptions', {
  list: {
    queryKey: null,
    contextQueries: {
      byFormationDetailId: (formationDetailId: string) => ({
        queryKey: [formationDetailId],
        queryFn: () => getFormationSubscriptionsByFormationDetailId(formationDetailId),
      }),
    },
  },
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getFormationSubscriptionById(id),
      }),
    },
  },
});
