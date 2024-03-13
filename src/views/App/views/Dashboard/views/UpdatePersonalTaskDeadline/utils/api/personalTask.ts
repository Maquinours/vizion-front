import { privateInstance } from '../../../../../../../../utils/functions/axios';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';

export const updateTaskDeadline = async (id: string, deadline: Date) => {
  return (
    await privateInstance({
      method: 'POST',
      url: `/workloads/v1/tasks/update-deadline`,
      data: {
        id,
        deadline,
      },
    })
  ).data as TaskResponseDto;
};
