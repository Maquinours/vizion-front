import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import PredefinedMessageRequestDto from '../types/PredefinedMessageRequestDto';
import PredefinedMessageResponseDto from '../types/PredefinedMessageResponseDto';

export const getAllPredefinedMessages = async () => {
  return (
    await privateInstance<Array<PredefinedMessageResponseDto>>({
      method: 'GET',
      url: `/predefined-messages/v1/message/list`,
    })
  ).data;
};

export const createPredefinedMessage = (data: PredefinedMessageRequestDto) => {
  return privateInstance<PredefinedMessageResponseDto>({
    method: 'POST',
    url: '/predefined-messages/v1/message/add',
    data,
  }).then((res) => res.data);
};

export const getPredefinedMessagesPage = (page: number, size: number) => {
  return privateInstance<Page<PredefinedMessageResponseDto>>({
    method: 'GET',
    url: `/predefined-messages/v1/message/list-page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};

export const getPredefinedMessageById = (id: string) => {
  return privateInstance<PredefinedMessageResponseDto>({
    method: 'GET',
    url: `/predefined-messages/v1/message/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updatePredefinedMessage = (id: string, data: PredefinedMessageRequestDto) => {
  return privateInstance<PredefinedMessageResponseDto>({
    method: 'PUT',
    url: `/predefined-messages/v1/message/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deletePredefinedMessage = (id: string) => {
  return privateInstance({
    method: 'DELETE',
    url: `/predefined-messages/v1/message/delete/${encodeURIComponent(id)}`,
  });
};
