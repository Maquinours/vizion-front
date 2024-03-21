import AssistanceDeliveryResponseDto from './AssistanceDeliveryResponseDto';

type AssistanceDeliveryDetailDeliveryResponseDto = Omit<AssistanceDeliveryResponseDto, 'details'>;

type AssistanceDeliveryDetailResponseDto = {
  id: string;
  productRef: string;
  productSerialNumber: string;
  businessNum: string;
  issue: string | null;
  warranty: boolean | null;
  comment: string | null;
  found: boolean | null;
  solution: string | null;
  internalComment: string | null;
  delivery: AssistanceDeliveryDetailDeliveryResponseDto | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AssistanceDeliveryDetailResponseDto;
