import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import AllBusinessResponseDto from '../../../../../../utils/types/AllBusinessResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/delete-link/$associatedId')({
  loader: async ({ context: { queryClient }, params: { associatedId } }) => {
    let initialDataKey: QueryKey | undefined;

    await queryClient.ensureQueryData({
      ...queries['all-businesses'].detail._ctx.byId(associatedId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Array<AllBusinessResponseDto>>({ queryKey: queries['all-businesses'].list.queryKey })) {
          const item = value?.find((item) => item.id === associatedId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined,
    });
  },
});
