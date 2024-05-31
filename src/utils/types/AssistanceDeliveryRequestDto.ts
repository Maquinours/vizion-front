import AssistanceDeliveryDetailRequestDto from './AssistanceDeliveryDetailRequestDto';

type AssistanceDeliveryRequestDto = {
  assistanceId: string | null;
  detailDtoList?: Array<AssistanceDeliveryDetailRequestDto> | null;
};

export default AssistanceDeliveryRequestDto;
