import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { QueryKey } from '@tanstack/react-query';
import FormationSubscriptionResponseDto from '../../../../../../utils/types/FormationSubscriptionResponseDto';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/formations/subscribers/$formationDetailId/send-email/$subscriptionId')({
  loader: async ({ context: { queryClient }, params: { subscriptionId } }) => {
    let initialDataKey: QueryKey | undefined;
    await queryClient.ensureQueryData({
      ...queries['formation-subscriptions'].detail._ctx.byId(subscriptionId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Array<FormationSubscriptionResponseDto>>({
          queryKey: queries['formation-subscriptions'].list.queryKey,
        })) {
          const item = value?.find((item) => item.id === subscriptionId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
  pendingComponent: LoaderModal,
});
