import { privateInstance } from '../functions/axios';
import BusinessBpDetailsRequestDto from '../types/BusinessBpDetailsRequestDto';
import BusinessBpDetailsResponseDto from '../types/BusinessBpDetailsResponseDto';

export const createBusinessBpDetail = (data: BusinessBpDetailsRequestDto) => {
  return privateInstance<BusinessBpDetailsResponseDto>({
    method: 'POST',
    url: '/business/v1/business/bp/details/add',
    data,
  }).then((res) => res.data);
};

export const getBusinessBpDetailById = (id: string) => {
  return privateInstance<BusinessBpDetailsResponseDto>({
    method: 'GET',
    url: `/business/v1/business/bp/details/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateBusinessBpDetail = (id: string, data: BusinessBpDetailsRequestDto) => {
  return privateInstance<BusinessBpDetailsResponseDto>({
    method: 'PUT',
    url: `/business/v1/business/bp/details/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteBusinessBpDetail = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/business/v1/business/bp/details/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
