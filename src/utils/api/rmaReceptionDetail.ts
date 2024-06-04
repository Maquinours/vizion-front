import { privateInstance } from '../functions/axios';
import AssistanceReceptionDetailRequestDto from '../types/AssistanceReceptionDetailRequestDto';
import AssistanceReceptionDetailResponseDto from '../types/AssistanceReceptionDetailResponseDto';

export const createRmaReceptionDetail = (data: AssistanceReceptionDetailRequestDto) => {
  return privateInstance<AssistanceReceptionDetailResponseDto>({
    method: 'POST',
    url: '/rma/v1/assistance-reception-detail/',
    data,
  }).then((res) => res.data);
};

export const getRmaReceptionDetailById = (id: string) => {
  return privateInstance<AssistanceReceptionDetailResponseDto>({
    method: 'GET',
    url: `/rma/v1/assistance-reception-detail/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateRmaReceptionDetail = (id: string, data: AssistanceReceptionDetailRequestDto) => {
  return privateInstance<AssistanceReceptionDetailResponseDto>({
    method: 'PUT',
    url: `/rma/v1/assistance-reception-detail/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteRmaReceptionDetail = (id: string) => {
  return privateInstance<AssistanceReceptionDetailResponseDto>({
    method: 'DELETE',
    url: `/rma/v1/assistance-reception-detail/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
