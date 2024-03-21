import { privateInstance } from '../../../../../../../../utils/functions/axios';
import EnterpriseResponseDto from '../../../../../../../../utils/types/EnterpriseResponseDto';

export const deleteEnterprise = async (enterprise: EnterpriseResponseDto) => {
  return (
    await privateInstance({
      method: 'DELETE',
      url: `profile/v1/contact/delete`,
      params: {
        id: enterprise.id,
      },
    })
  ).data;
};
