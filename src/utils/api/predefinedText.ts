import { privateInstance } from '../functions/axios';
import Page from '../types/Page';
import PredefinedTextRequestDto from '../types/PredefinedTextRequestDto';
import PredefinedTextResponseDto from '../types/PredefinedTextResponseDto';

export const getPredefinedTexts = async () => {
  return (
    await privateInstance<Array<PredefinedTextResponseDto>>({
      method: 'GET',
      url: `/predefined-messages/v1/text/list`,
    })
  ).data;
};

export const createPredefinedText = (data: PredefinedTextRequestDto) => {
  return privateInstance<PredefinedTextResponseDto>({
    method: 'POST',
    url: '/predefined-messages/v1/text/add',
    data,
  });
};

export const getPredefinedTextById = (id: string) => {
  return privateInstance<PredefinedTextResponseDto>({
    method: 'GET',
    url: `/predefined-messages/v1/text/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updatePredefinedText = (id: string, data: PredefinedTextRequestDto) => {
  return privateInstance<PredefinedTextResponseDto>({
    method: 'PUT',
    url: `/predefined-messages/v1/text/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deletePredefinedText = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/predefined-messages/v1/text/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const getPredefinedTextsPage = ({ page, size }: { page: number; size: number }) => {
  return privateInstance<Page<PredefinedTextResponseDto>>({
    method: 'GET',
    url: `/predefined-messages/v1/text/list-page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
  }).then((res) => res.data);
};
