import { privateInstance } from '../functions/axios';
import AssistanceDeliveryRequestDto from '../types/AssistanceDeliveryRequestDto';
import AssistanceDeliveryResponseDto from '../types/AssistanceDeliveryResponseDto';

export const createRmaDelivery = (data: AssistanceDeliveryRequestDto) => {
  return privateInstance<AssistanceDeliveryResponseDto>({
    method: 'POST',
    url: '/rma/v1/assistance-analyse-delivery/',
    data,
  }).then((res) => res.data);
};
