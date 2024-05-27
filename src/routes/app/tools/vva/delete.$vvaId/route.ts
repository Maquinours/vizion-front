import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import SalesVvaResponseDto from '../../../../../utils/types/SalesVvaResponseDto';
import Page from '../../../../../utils/types/Page';
import { QueryKey } from '@tanstack/react-query';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/vva/delete/$vvaId')({
  loader: async ({ context: { queryClient }, params: { vvaId } }) => {
    let initialDataKey: QueryKey | undefined;
    await queryClient.ensureQueryData({
      ...queries['sales-vva'].detail(vvaId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<SalesVvaResponseDto>>({ queryKey: queries['sales-vva'].page._def })) {
          const data = value?.content.find((vva) => vva.id === vvaId);
          if (data) {
            initialDataKey = key;
            return data;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
  pendingComponent: LoaderModal,
});
