import { privateInstance } from '../../../../../../../../../../utils/functions/axios';
import TaskResponseDto from '../../../../../../../../../../utils/types/TaskResponseDto';

export const markTaskAsRead = async (task: TaskResponseDto) => {
  return (
    await privateInstance<TaskResponseDto>({
      method: 'PUT',
      url: `/workloads/v1/tasks/read/${encodeURIComponent(task.id)}`,
    })
  ).data;
};
