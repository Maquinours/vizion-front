import { privateInstance } from '../functions/axios';
import TechnicalSupportRecapOptionRequestDto from '../types/TechnicalSupportRecapOptionRequestDto';
import TechnicalSupportRecapOptionResponseDto from '../types/TechnicalSupportRecapOptionResponseDto';

export const getTechnicalSupportRecapOptionsByTechnicalSupportId = (technicalSupportId: string) => {
  return privateInstance<Array<TechnicalSupportRecapOptionResponseDto>>({
    method: 'GET',
    url: `/all-business/v1/technical-assistance-detail-recap/all-by-support`,
    params: {
      supportId: technicalSupportId,
    },
  }).then((res) => res.data);
};

export const createTechnicalSupportRecapOption = (data: TechnicalSupportRecapOptionRequestDto) => {
  return privateInstance<TechnicalSupportRecapOptionResponseDto>({
    method: 'POST',
    url: '/all-business/v1/technical-assistance-detail-recap/',
    data,
  }).then((res) => res.data);
};

export const createTechnicalSupportRecapOptions = ({ supportId, data }: { supportId: string; data: Array<TechnicalSupportRecapOptionRequestDto> }) => {
  return privateInstance<Array<TechnicalSupportRecapOptionResponseDto>>({
    method: 'POST',
    url: `/all-business/v1/technical-assistance-detail-recap/all`,
    params: {
      supportId,
    },
    data,
  }).then((res) => res.data);
};

export const updateTechnicalSupportRecapOption = (id: string, data: TechnicalSupportRecapOptionRequestDto) => {
  return privateInstance<TechnicalSupportRecapOptionResponseDto>({
    method: 'PUT',
    url: `/all-business/v1/technical-assistance-detail-recap/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteTechnicalSupportRecapOption = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/all-business/v1/technical-assistance-detail-recap/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
