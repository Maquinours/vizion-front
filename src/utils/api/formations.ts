import { privateInstance } from '../functions/axios';
import FormationRequestDto from '../types/FormationRequestDto';
import FormationResponseDto from '../types/FormationResponseDto';
import Page from '../types/Page';

export const getFormationsPage = ({ page, size }: { page: number; size: number }) => {
  return privateInstance<Page<FormationResponseDto>>({
    method: 'GET',
    url: `/rdv/v1/formation/page`,
    params: {
      page,
      size,
    },
  }).then((res) => res.data);
};

export const createFormation = (data: FormationRequestDto) => {
  return privateInstance<FormationResponseDto>({
    method: 'POST',
    url: `/rdv/v1/formation/add`,
    data,
  }).then((res) => res.data);
};

export const deleteFormation = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/rdv/v1/formation/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getFormationById = (id: string) => {
  return privateInstance<FormationResponseDto>({
    method: 'GET',
    url: `/rdv/v1/formation/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateFormation = (id: string, data: FormationRequestDto) => {
  return privateInstance<FormationResponseDto>({
    method: 'PUT',
    url: `/rdv/v1/formation/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
