import { createFileRoute } from '@tanstack/react-router';
import { getTaskById } from '../../../../utils/api/task';
import { queries } from '../../../../utils/constants/queryKeys';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import CategoryClient from '../../../../utils/enums/CategoryClient';

export const Route = createFileRoute('/app/dashboard/transfer-task/$taskId')({
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    Promise.all([
      queryClient.ensureQueryData({
        queryKey: taskQueryKeys.detailById(taskId),
        queryFn: () => getTaskById(taskId),
      }),
      queryClient.ensureQueryData(queries.enterprise.list._ctx.byCategory(CategoryClient.VIZEO)._ctx.profiles._ctx.list),
    ]);
  },
});
