import { privateInstance } from '../../../../../../../../utils/functions/axios';
import ProgressiveInfoRequestDto from '../../../../../../../../utils/types/ProgressiveInfoRequestDto';
import ProgressiveInfoResponseDto from '../../../../../../../../utils/types/ProgressiveInfoResponseDto';

export const updateProgressiveInfo = async (id: string, data: ProgressiveInfoRequestDto) => {
  return (
    await privateInstance<ProgressiveInfoResponseDto>({
      method: 'PUT',
      url: `/progressive-info/v1/progressive-info/update/${encodeURIComponent(id)}`,
      data,
    })
  ).data;
};
