import { privateInstance } from '../functions/axios';
import AssistanceSupportDetailRequestDto from '../types/AssistanceSupportDetailRequestDto';
import AssistanceSupportDetailResponseDto from '../types/AssistanceSupportDetailResponseDto';

export const createRmaSupportDetail = (data: AssistanceSupportDetailRequestDto) => {
  return privateInstance<AssistanceSupportDetailResponseDto>({
    method: 'POST',
    url: '/rma/v1/assistance-support-detail/',
    data,
  }).then((res) => res.data);
};

export const updateRmaSupportDetail = (id: string, data: AssistanceSupportDetailRequestDto) => {
  return privateInstance<AssistanceSupportDetailResponseDto>({
    method: 'PUT',
    url: `/rma/v1/assistance-support-detail/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const getRmaSupportDetailById = (id: string) => {
  return privateInstance<AssistanceSupportDetailResponseDto>({
    method: 'PUT',
    url: `/rma/v1/assistance-support-detail/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const deleteRmaSupportDetail = (id: string) => {
  return privateInstance<AssistanceSupportDetailResponseDto>({
    method: 'DELETE',
    url: `/rma/v1/assistance-support-detail/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
