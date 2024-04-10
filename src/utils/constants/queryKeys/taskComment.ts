import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getTaskCommentsByTaskId } from '../../../views/App/views/Dashboard/views/TaskCommentsModal/components/Comments/utils/api/taskComments';

export const taskComments = createQueryKeys('task-comments', {
  list: {
    queryKey: null,
    contextQueries: {
      byTaskId: (taskId: string) => ({
        queryKey: [taskId],
        queryFn: () => getTaskCommentsByTaskId(taskId),
      }),
    },
  },
});
