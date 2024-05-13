import { QueryKey } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import Page from '../../../../../utils/types/Page';
import { queries } from '../../../../../utils/constants/queryKeys';
import PredefinedMessageResponseDto from '../../../../../utils/types/PredefinedMessageResponseDto';

export const Route = createFileRoute('/app/tools/predefined-messages/update/$predefinedMessageId')({
  loader: async ({ context: { queryClient }, params: { predefinedMessageId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...queries['predefined-message'].detail(predefinedMessageId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<PredefinedMessageResponseDto>>({
          queryKey: queries['predefined-message'].page._def,
        })) {
          const item = value?.content.find((item) => item.id === predefinedMessageId);
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
