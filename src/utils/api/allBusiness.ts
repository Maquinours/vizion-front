import { privateInstance } from '../functions/axios';
import AllBusinessResponseDto from '../types/AllBusinessResponseDto';
import Page from '../types/Page';

export const getAllBusinesses = async () => {
  return (
    await privateInstance<Array<AllBusinessResponseDto>>({
      method: 'GET',
      url: `/all-business/v1/all-business-and-rma/`,
    })
  ).data;
};

export const getAllBusinessPageByEnterpriseId = async (enterpriseId: string, page: number, size: number) => {
  return (
    await privateInstance<Page<AllBusinessResponseDto>>({
      method: 'GET',
      url: `/all-business/v1/all-business-and-rma/find/enterprise/page`,
      params: {
        enterpriseId,
        page,
        size,
      },
    })
  ).data;
};
