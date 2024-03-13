import { privateInstance } from '../../../../../../../../utils/functions/axios';
import TaskResponseDto from '../../../../../../../../utils/types/TaskResponseDto';

export const validateTask = async (id: string, profileId: string) => {
  return (
    await privateInstance<TaskResponseDto>({
      method: 'POST',
      url: `/workloads/v1/tasks/close`,
      params: {
        id,
        profileId,
      },
    })
  ).data;
};
