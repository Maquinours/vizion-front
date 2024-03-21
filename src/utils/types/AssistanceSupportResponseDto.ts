import AssistanceSupportDetailResponseDto from './AssistanceSupportDetailResponseDto';

type AssistanceSupportResponseDto = {
  id: string;
  details: AssistanceSupportDetailResponseDto[] | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AssistanceSupportResponseDto;
