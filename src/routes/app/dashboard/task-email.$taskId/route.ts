import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import { emails } from '../../../../utils/constants/queryKeys/email';
import { QueryKey } from '@tanstack/react-query';
import TaskResponseDto from '../../../../utils/types/TaskResponseDto';
import Page from '../../../../utils/types/Page';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/task-email/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    const task = await queryClient.ensureQueryData({
      ...queries.tasks.detail(taskId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Array<TaskResponseDto>>({ queryKey: queries.tasks.list.queryKey })) {
          const item = value?.find((item) => item.id === taskId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
        for (const [key, value] of queryClient.getQueriesData<Page<TaskResponseDto>>({ queryKey: queries.tasks.page.queryKey })) {
          const item = value?.content.find((item) => item.id === taskId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
    const emailId = task.mailId;
    if (!emailId) throw notFound();

    await queryClient.ensureQueryData(emails.detail(emailId));
  },
  pendingComponent: LoaderModal,
});
