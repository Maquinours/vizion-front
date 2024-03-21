import AssistanceDeliveryDetailResponseDto from './AssistanceDeliveryDetailResponseDto';

type AssistanceDeliveryResponseDto = {
  id: string;
  details: AssistanceDeliveryDetailResponseDto[] | null;
  createdDate: Date;
  modifiedDate: Date | null;
  createdBy: string | null;
  modifiedBy: string | null;
};

export default AssistanceDeliveryResponseDto;
