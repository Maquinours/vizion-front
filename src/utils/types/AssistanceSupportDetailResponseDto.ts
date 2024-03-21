import AssistanceSupportResponseDto from './AssistanceSupportResponseDto';

type AssistanceSupportDetailSupportResponseDto = Omit<AssistanceSupportResponseDto, 'details' | 'assistanceSup'>;

type AssistanceSupportDetailResponseDto = {
  id: string;
  productRef: string | null;
  productSerialNumber: string;
  businessNum: string;
  issue: string | null;
  warranty: boolean | null;
  comment: string | null;
  internalComment: string | null;
  support: AssistanceSupportDetailSupportResponseDto | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AssistanceSupportDetailResponseDto;
