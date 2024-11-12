import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../utils/constants/queryKeys';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../utils/types/Page';
import TaskResponseDto from '../../../../utils/types/TaskResponseDto';
import { redirect } from '@tanstack/react-router';
import { emails } from '../../../../utils/constants/queryKeys/email';

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/task-email/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    const task = await queryClient.ensureQueryData({
      ...queries.tasks.detail(taskId),
      initialData: () => {
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
    if (!task?.mailId)
      throw redirect({
        from: Route.fullPath,
        to: '../..',
        search: true,
        replace: true,
        resetScroll: false,
      });
    await queryClient.ensureQueryData(emails.detail(task.mailId));
  },
  pendingComponent: LoaderModal,
});
