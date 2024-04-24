import { privateInstance } from '../functions/axios';
import BusinessArcRequestDto from '../types/BusinessArcRequestDto';
import BusinessArcResponseDto from '../types/BusinessArcResponseDto';

export const createBusinessArc = (data: BusinessArcRequestDto) => {
  return privateInstance<BusinessArcResponseDto>({
    method: 'POST',
    url: '/business/v1/business/arc/add',
    data,
  }).then((res) => res.data);
};
