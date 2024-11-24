import { privateInstance } from '../functions/axios';
import BusinessBlDetailsResponseDto from '../types/BusinessBlDetailsResponseDto';
import UpdateBusinessBlDetailsRequestDto from '../types/UpdateBusinessBlDetailsRequestDto';

export const updateBusinessBlDetails = async (data: UpdateBusinessBlDetailsRequestDto) => {
  return privateInstance<Array<BusinessBlDetailsResponseDto>>({
    method: 'PUT',
    url: '/business/v1/business/bl/details/list',
    data: data,
  }).then((res) => res.data);
};
