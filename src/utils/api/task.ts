import { privateInstance } from '../functions/axios';
import TaskRequestDto from '../types/TaskRequestDto';
import TaskResponseDto from '../types/TaskResponseDto';

export const createTask = async (task: TaskRequestDto) => {
  return (
    await privateInstance<TaskResponseDto>({
      method: 'POST',
      url: '/workloads/v1/tasks/add',
      data: task,
    })
  ).data;
};
