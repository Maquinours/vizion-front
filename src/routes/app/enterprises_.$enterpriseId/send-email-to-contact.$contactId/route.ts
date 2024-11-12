import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../utils/types/Page';
import ProfileResponseDto from '../../../../utils/types/ProfileResponseDto';

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/send-email-to-contact/$contactId')({
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
