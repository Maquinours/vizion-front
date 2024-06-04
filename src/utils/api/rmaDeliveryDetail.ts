import { privateInstance } from '../functions/axios';
import AssistanceDeliveryDetailRequestDto from '../types/AssistanceDeliveryDetailRequestDto';
import AssistanceDeliveryDetailResponseDto from '../types/AssistanceDeliveryDetailResponseDto';

export const createRmaDeliveryDetail = (data: AssistanceDeliveryDetailRequestDto) => {
  return privateInstance<AssistanceDeliveryDetailResponseDto>({
    method: 'POST',
    url: '/rma/v1/assistance-analyse-delivery-detail/',
    data: data,
  }).then((res) => res.data);
};

export const getRmaDeliveryDetailById = (id: string) => {
  return privateInstance<AssistanceDeliveryDetailResponseDto>({
    method: 'GET',
    url: `/rma/v1/assistance-analyse-delivery-detail/${id}`,
  }).then((res) => res.data);
};

export const updateRmaDeliveryDetail = (id: string, data: AssistanceDeliveryDetailRequestDto) => {
  return privateInstance<AssistanceDeliveryDetailResponseDto>({
    method: 'PUT',
    url: `/rma/v1/assistance-analyse-delivery-detail/${id}`,
    data: data,
  }).then((res) => res.data);
};

export const deleteRmaDeliveryDetail = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/rma/v1/assistance-analyse-delivery-detail/${id}`,
  }).then((res) => res.data);
};
