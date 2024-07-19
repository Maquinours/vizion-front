import { privateInstance } from '../functions/axios';
import SynopticRequestDto from '../types/SynopticRequestDto';
import SynopticResponseDto from '../types/SynopticResponseDto';

export const saveSynopticBusiness = (data: SynopticRequestDto) => {
  return privateInstance<SynopticResponseDto>({
    method: 'POST',
    url: '/business/v1/synoptic-business/store',
    data,
  }).then((res) => res.data);
};
