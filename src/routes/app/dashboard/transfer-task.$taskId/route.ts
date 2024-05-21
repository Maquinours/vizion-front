import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../utils/types/Page';
import TaskResponseDto from '../../../../utils/types/TaskResponseDto';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/transfer-task/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await Promise.all([
      queryClient.ensureQueryData({
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
      }),
      queryClient.ensureQueryData(queries.enterprise.list._ctx.byCategory(CategoryClient.VIZEO)._ctx.profiles._ctx.list),
    ]);
  },
  pendingComponent: LoaderModal,
});
