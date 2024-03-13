import { privateInstance } from '../../../../../../../../../../utils/functions/axios';
import TaskCommentRequestDto from '../../../../../../../../../../utils/types/TaskCommentRequestDto';
import TaskCommentResponseDto from '../../../../../../../../../../utils/types/TaskCommentResponseDto';

export const createTaskComment = async (data: TaskCommentRequestDto) => {
  return (
    await privateInstance<TaskCommentResponseDto>({
      method: 'POST',
      url: '/workloads/v1/tasks/comments/add',
      data,
    })
  ).data;
};
