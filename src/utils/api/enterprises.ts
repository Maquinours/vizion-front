import CategoryClient from '../enums/CategoryClient';
import { privateInstance } from '../functions/axios';
import EnterpriseResponseDto from '../types/EnterpriseResponseDto';

export const getEnterprisesByCategory = async (category: CategoryClient) => {
  return (
    await privateInstance<Array<EnterpriseResponseDto>>({
      method: 'GET',
      url: `profile/v1/contact/all-by-category`,
      params: {
        category,
      },
    })
  ).data;
};
