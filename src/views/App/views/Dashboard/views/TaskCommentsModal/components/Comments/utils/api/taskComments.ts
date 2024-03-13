import { privateInstance } from '../../../../../../../../../../utils/functions/axios';
import TaskCommentResponseDto from '../../../../../../../../../../utils/types/TaskCommentResponseDto';

export const getTaskCommentsByTaskId = async (taskId: string) => {
  return (
    await privateInstance<Array<TaskCommentResponseDto>>({
      method: 'GET',
      url: `/workloads/v1/tasks/comments/find-all-by-task`,
      params: {
        id: taskId,
      },
    })
  ).data;
};
