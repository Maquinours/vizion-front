import { privateInstance } from '../../../../../../../../utils/functions/axios';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';

export const deleteTask = async (task: TaskResponseDto) => {
  return (
    await privateInstance<void>({
      method: 'DELETE',
      url: `/workloads/v1/tasks/delete`,
      params: {
        id: task.id,
      },
    })
  ).data;
};
