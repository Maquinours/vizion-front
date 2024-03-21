import { privateInstance } from '../functions/axios';
import PredefinedTextResponseDto from '../types/PredefinedTextResponseDto';

export const getPredefinedTexts = async () => {
  return (
    await privateInstance<Array<PredefinedTextResponseDto>>({
      method: 'GET',
      url: `/predefined-messages/v1/text/list`,
    })
  ).data;
};
