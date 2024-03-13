import { privateInstance } from '../functions/axios';
import AllBusinessResponseDto from '../types/AllBusinessResponseDto';

export const getAllBusinesses = async () => {
  return (
    await privateInstance<Array<AllBusinessResponseDto>>({
      method: 'GET',
      url: `/all-business/v1/all-business-and-rma/`,
    })
  ).data;
};
