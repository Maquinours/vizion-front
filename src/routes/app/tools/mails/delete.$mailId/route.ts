import { createFileRoute } from '@tanstack/react-router';
import { mailQueryKeys } from '../../../../../utils/constants/queryKeys/mails';
import Page from '../../../../../utils/types/Page';
import MailPaperResponseDto from '../../../../../utils/types/MailPaperResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/mails/delete/$mailId')({
  loader: async ({ context: { queryClient }, params: { mailId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    await queryClient.ensureQueryData({
      ...mailQueryKeys.detail._ctx.byId(mailId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<MailPaperResponseDto>>({ queryKey: mailQueryKeys.page.queryKey })) {
          const item = value?.content.find((item) => item.id === mailId);
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