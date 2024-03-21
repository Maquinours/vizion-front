import { privateInstance } from '../functions/axios';
import EnterpriseInfoSupRequestDto from '../types/EnterpriseInfoSupRequestDto';
import EnterpriseInfoSupResponseDto from '../types/EnterpriseInfoSupResponseDto';

export const updateEnterpriseInfoSup = async (old: EnterpriseInfoSupResponseDto, data: EnterpriseInfoSupRequestDto) => {
  return (
    await privateInstance<EnterpriseInfoSupResponseDto>({
      method: 'PUT',
      url: `profile/v1/additional-information/update/${old.id}`,
      data,
    })
  ).data;
};
