type TaskCommentResponseDto = {
  id: string;
  author: string | null;
  comment: string | null;
  commontOpened: boolean | null;
  createdDate: Date | null;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default TaskCommentResponseDto;
