import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import WorkloadType from '../../../../utils/enums/WorkloadType';
import TaskResponseDto from '../../../../utils/types/TaskResponseDto';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/take-collective-task/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    await queryClient.ensureQueryData({
      ...queries.tasks.detail(taskId),
      initialData: () => {
        for (const [, value] of queryClient.getQueriesData<Array<TaskResponseDto>>({
          queryKey: queries.tasks.list._ctx.byType(WorkloadType.COLLECTIVE).queryKey,
        })) {
          const item = value?.find((item) => item.id === taskId);
          if (item) return item;
        }
      },
      initialDataUpdatedAt: () => queryClient.getQueryState(queries.tasks.list._ctx.byType(WorkloadType.COLLECTIVE).queryKey)?.dataUpdatedAt,
    });
  },
  pendingComponent: LoaderModal,
});
