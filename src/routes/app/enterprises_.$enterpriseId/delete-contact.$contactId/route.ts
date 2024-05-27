import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import Page from '../../../../utils/types/Page';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/delete-contact/$contactId')({
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    await queryClient.ensureQueryData({
      ...queries.profiles.detail(contactId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<ProfileResponseDto>>({ queryKey: queries.profiles.page.queryKey })) {
          const item = value?.content.find((item) => item.id === contactId);
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
