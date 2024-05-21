import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import PredefinedTextResponseDto from '../../../../../utils/types/PredefinedTextResponseDto';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../../utils/types/Page';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/predefined-texts/update/$predefinedTextId')({
  loader: async ({ context: { queryClient }, params: { predefinedTextId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    await queryClient.ensureQueryData({
      ...queries['predefined-text'].detail(predefinedTextId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<PredefinedTextResponseDto>>({ queryKey: queries['predefined-text'].page._def })) {
          const item = value?.content.find((item) => item.id === predefinedTextId);
          if (item) {
            initialDataKey = key;
            return value;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
  pendingComponent: LoaderModal,
});
