import { privateInstance } from '../functions/axios';
import ArcDetailRequestDto from '../types/ArcDetailRequestDto';
import BusinessArcDetailsRequestDto from '../types/BusinessArcDetailsRequestDto';
import BusinessArcDetailsResponseDto from '../types/BusinessArcDetailsResponseDto';

export const createBusinessArcDetail = (data: BusinessArcDetailsRequestDto) => {
  return privateInstance<BusinessArcDetailsResponseDto>({
    method: 'POST',
    url: '/business/v1/business/arc/details/add',
    data: data,
  }).then((res) => res.data);
};

export const getBusinessArcDetailById = (id: string) => {
  return privateInstance<BusinessArcDetailsResponseDto>({
    method: 'GET',
    url: `/business/v1/business/arc/details/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateBusinessArcDetail = (id: string, data: BusinessArcDetailsRequestDto) => {
  return privateInstance<BusinessArcDetailsResponseDto>({
    method: 'PUT',
    url: `/business/v1/business/arc/details/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteBusinessArcDetail = (id: string, data: ArcDetailRequestDto) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/business/v1/business/arc/details/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};
