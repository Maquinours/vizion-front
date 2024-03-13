import { privateInstance } from '../../../../../../../../utils/functions/axios';
import ProgressiveInfoRequestDto from '../../../../../../../../utils/types/ProgressiveInfoRequestDto';
import ProgressiveInfoResponseDto from '../../../../../../../../utils/types/ProgressiveInfoResponseDto';

export const createProgressiveInfo = async (data: ProgressiveInfoRequestDto) => {
  return (
    await privateInstance({
      method: 'POST',
      url: `/progressive-info/v1/progressive-info/store`,
      data,
    })
  ).data as ProgressiveInfoResponseDto;
};
