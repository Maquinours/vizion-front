import { createFileRoute } from '@tanstack/react-router';
import { taskCommentsQueryKeys } from '../../../../utils/constants/queryKeys/taskComment';
import { getTaskCommentsByTaskId } from '../../../../views/App/views/Dashboard/views/TaskCommentsModal/components/Comments/utils/api/taskComments';

export const Route = createFileRoute('/app/dashboard/task-comments/$taskId')({
  loader: ({ context: { queryClient }, params: { taskId } }) =>
    queryClient.ensureQueryData({
      queryKey: taskCommentsQueryKeys.listByTaskId(taskId),
      queryFn: () => getTaskCommentsByTaskId(taskId),
    }),
});
