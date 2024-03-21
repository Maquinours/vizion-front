import { privateInstance } from '../functions/axios';
import EnterpriseAccountabilityRequestDto from '../types/EnterpriseAccountabilityRequestDto';
import EnterpriseAccountabilityResponseDto from '../types/EnterpriseAccountabilityResponseDto';

export const updateEnterpriseAccountability = async (accountability: EnterpriseAccountabilityResponseDto, data: EnterpriseAccountabilityRequestDto) => {
  return (
    await privateInstance<EnterpriseAccountabilityResponseDto>({
      method: 'PUT',
      url: `profile/v1/accountability/update/${encodeURIComponent(accountability.id)}`,
      data,
    })
  ).data;
};
