import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import PredefinedTextResponseDto from '../../../../../utils/types/PredefinedTextResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/predefined-texts/delete/$predefinedTextId')({
  loader: async ({ context: { queryClient }, params: { predefinedTextId } }) => {
    let initialDataKey: QueryKey;

    await queryClient.ensureQueryData({
      ...queries['predefined-text'].detail(predefinedTextId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<PredefinedTextResponseDto>({ queryKey: queries['predefined-text'].page._def })) {
          if (value?.id === predefinedTextId) {
            initialDataKey = key;
            return value;
          }
        }
      },
      initialDataUpdatedAt: () => queryClient.getQueryState(initialDataKey)?.dataUpdatedAt,
    });
  },
});
