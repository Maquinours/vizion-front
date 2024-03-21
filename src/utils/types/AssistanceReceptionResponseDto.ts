import AssistanceReceptionDetailResponseDto from './AssistanceReceptionDetailResponseDto';

type AssistanceReceptionResponseDto = {
  id: string;
  details: AssistanceReceptionDetailResponseDto[] | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AssistanceReceptionResponseDto;
