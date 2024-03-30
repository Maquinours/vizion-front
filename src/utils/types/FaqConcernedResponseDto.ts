type FaqConcernedResponseDto = {
  id: string;
  name: string;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default FaqConcernedResponseDto;
