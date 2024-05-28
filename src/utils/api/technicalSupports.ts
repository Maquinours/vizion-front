import CategoryBusiness from '../enums/CategoryBusiness';
import { privateInstance } from '../functions/axios';
import TechnicalSupportRequestDto from '../types/TechnicalSupportRequestDto';
import TechnicalSupportResponseDto from '../types/TechnicalSupportResponseDto';

export const getTechnicalSupportsByBusinessOrRmaNumber = ({ categoryBusiness, number }: { categoryBusiness: CategoryBusiness; number: string }) => {
  return privateInstance<Array<TechnicalSupportResponseDto>>({
    method: 'GET',
    url: `/all-business/v1/technical-assistance/find-by-business`,
    params: {
      categoryBusiness,
      number,
    },
  }).then((res) => res.data);
};

export const createTechnicalSupport = (data: TechnicalSupportRequestDto) => {
  return privateInstance<TechnicalSupportResponseDto>({
    method: 'POST',
    url: '/all-business/v1/technical-assistance/',
    data,
  }).then((res) => res.data);
};

export const getTechnicalSupportById = (id: string) => {
  return privateInstance<TechnicalSupportResponseDto>({
    method: 'GET',
    url: `/all-business/v1/technical-assistance/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const deleteTechnicalSupport = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/all-business/v1/technical-assistance/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateTechnicalSupport = (id: string, data: TechnicalSupportRequestDto) => {
  return privateInstance<TechnicalSupportResponseDto>({
    method: 'PUT',
    url: `/all-business/v1/technical-assistance/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
