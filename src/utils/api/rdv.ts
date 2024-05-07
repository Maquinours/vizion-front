import { format } from 'date-fns';
import { privateInstance } from '../functions/axios';
import RdvRequestDto from '../types/RdvRequestDto';
import RdvResponseDto from '../types/RdvResponseDto';

export const createRdv = (data: RdvRequestDto) => {
  return privateInstance<RdvResponseDto>({
    method: 'POST',
    url: `rdv/v1/add`,
    data: {
      ...data,
      startDateTime: format(data.startDateTime, 'yyyy-MM-dd HH:mm:ss'),
      endDatetime: format(data.endDatetime, 'yyyy-MM-dd HH:mm:ss'),
    },
  }).then((res) => res.data);
};

export const getRdvById = (id: string) => {
  return privateInstance<RdvResponseDto>({
    method: 'GET',
    url: `rdv/v1/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateRdv = (id: string, data: RdvRequestDto) => {
  return privateInstance<RdvResponseDto>({
    method: 'PUT',
    url: `rdv/v1/update/${encodeURIComponent(id)}`,
    data: {
      ...data,
      startDateTime: format(data.startDateTime, 'yyyy-MM-dd HH:mm:ss'),
      endDatetime: format(data.endDatetime, 'yyyy-MM-dd HH:mm:ss'),
    },
  }).then((res) => res.data);
};

export const deleteRdv = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `rdv/v1/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
