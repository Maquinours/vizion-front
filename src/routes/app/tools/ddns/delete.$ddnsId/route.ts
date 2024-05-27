import { createFileRoute } from '@tanstack/react-router';
import { ddns } from '../../../../../utils/constants/queryKeys/ddns';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../../utils/types/Page';
import DnsEntryResponseDto from '../../../../../utils/types/DnsEntryResponseDto';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/ddns/delete/$ddnsId')({
  loader: async ({ context: { queryClient }, params: { ddnsId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    await queryClient.ensureQueryData({
      ...ddns.detail(ddnsId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<DnsEntryResponseDto>>({ queryKey: ddns.page._def })) {
          const item = value?.content.find((item) => item.id === ddnsId);
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
