import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/dashboard/task-comments/$taskId')({
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    queryClient.prefetchQuery(queries['task-comments'].list._ctx.byTaskId(taskId));
  },
});
