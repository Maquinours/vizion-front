import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import Page from '../../../../../utils/types/Page';
import FormationResponseDto from '../../../../../utils/types/FormationResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/formations/update/$formationId')({
  loader: async ({ context: { queryClient }, params: { formationId } }) => {
    let initialDataKey: QueryKey | undefined;

    await queryClient.ensureQueryData({
      ...queries.formations.detail._ctx.byId(formationId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<FormationResponseDto>>({ queryKey: queries.formations.page._def })) {
          const item = value?.content.find((item) => item.id === formationId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
});
