import { privateInstance } from '../functions/axios';
import PredefinedMessageResponseDto from '../types/PredefinedMessageResponseDto';

export const getAllPredefinedMessages = async () => {
  return (
    await privateInstance<Array<PredefinedMessageResponseDto>>({
      method: 'GET',
      url: `/predefined-messages/v1/message/list`,
    })
  ).data;
};
