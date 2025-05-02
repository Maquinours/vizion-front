import { privateInstance } from '../functions/axios';
import BusinessBlDetailsRequestDto from '../types/BusinessBlDetailsRequestDto';
import BusinessBlDetailsResponseDto from '../types/BusinessBlDetailsResponseDto';
import UpdateBusinessBlDetailsRequestDto from '../types/UpdateBusinessBlDetailsRequestDto';

export const updateBusinessBlDetails = async (data: UpdateBusinessBlDetailsRequestDto) => {
  return privateInstance<Array<BusinessBlDetailsResponseDto>>({
    method: 'PUT',
    url: '/business/v1/business/bl/details/list',
    data: data,
  }).then((res) => res.data);
};

export const createBusinessBlDetail = async (data: BusinessBlDetailsRequestDto) => {
  return privateInstance<Array<BusinessBlDetailsResponseDto>>({
    method: 'POST',
    url: '/business/v1/business/bl/details/add',
    data: data,
  }).then((res) => res.data);
};
