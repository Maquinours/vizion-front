import { privateInstance } from '../functions/axios';
import EnterpriseResponseDto from '../types/EnterpriseResponseDto';

export const getEnterpriseById = async (id: string) => {
  return (
    await privateInstance<EnterpriseResponseDto>({
      method: 'GET',
      url: `profile/v1/contact/find-by-id/${encodeURIComponent(id)}`,
    })
  ).data;
};
