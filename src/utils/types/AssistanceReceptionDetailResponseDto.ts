import AssistanceReceptionResponseDto from './AssistanceReceptionResponseDto';

type AssistanceReceptionDetailReceptionResponseDto = Omit<AssistanceReceptionResponseDto, 'details' | 'assistanceRec'>;

type AssistanceReceptionDetailResponseDto = {
  id: string;
  productRef: string;
  productSerialNumber: string;
  businessNum: string;
  issue: string | null;
  warranty: boolean | null;
  externalComment: string | null;
  internalComment: string | null;
  reception: AssistanceReceptionDetailReceptionResponseDto | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AssistanceReceptionDetailResponseDto;
