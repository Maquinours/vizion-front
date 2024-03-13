import { createFileRoute } from '@tanstack/react-router';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../utils/api/task';

export const Route = createFileRoute('/app/dashboard/delete-collective-task/$taskId')({
  loader: ({ context: { queryClient }, params: { taskId } }) =>
    queryClient.ensureQueryData({
      queryKey: taskQueryKeys.detailById(taskId),
      queryFn: () => getTaskById(taskId),
    }),
});
