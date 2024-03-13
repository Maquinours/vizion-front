import { privateInstance } from '../functions/axios';
import ProgressiveInfoResponseDto from '../types/ProgressiveInfoResponseDto';

export const getProgressiveInfos = async () => {
  return (
    await privateInstance<Array<ProgressiveInfoResponseDto>>({
      method: 'GET',
      url: `/progressive-info/v1/progressive-info/all`,
    })
  ).data;
};

export const getProgressiveInfoById = async (id: string) => {
  return (
    await privateInstance<ProgressiveInfoResponseDto>({
      method: 'GET',
      url: `/progressive-info/v1/progressive-info/find-by-id/${encodeURIComponent(id)}`,
    })
  ).data;
};
