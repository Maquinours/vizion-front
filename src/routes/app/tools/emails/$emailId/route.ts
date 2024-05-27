import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../../utils/types/Page';
import MailResponseDto from '../../../../../utils/types/MailResponseDto';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/emails/$emailId')({
  loader: async ({ context: { queryClient }, params: { emailId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...queries.emails.detail(emailId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<MailResponseDto>>({
          queryKey: queries.emails.page.queryKey,
        })) {
          const item = value?.content.find((item) => item.id === emailId);
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
