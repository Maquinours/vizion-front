import { privateInstance } from '../functions/axios';
import ExternalLinkRequestDto from '../types/ExternalLinkRequestDto';
import ExternalLinkResponseDto from '../types/ExternalLinkResponseDto';
import Page from '../types/Page';

export const getExternalLinksPageByArchiveState = (archived: boolean, page: number, size: number) => {
  return privateInstance<Page<ExternalLinkResponseDto>>({
    method: 'GET',
    url: `product/v1/tools/list/archive-state/page`,
    params: {
      archived,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getExternalLinkById = (id: string) => {
  return privateInstance<ExternalLinkResponseDto>({
    method: 'GET',
    url: `product/v1/tools/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const createExternalLink = (data: ExternalLinkRequestDto) => {
  return privateInstance<ExternalLinkResponseDto>({
    method: 'POST',
    url: `product/v1/tools/add`,
    data,
  }).then((res) => res.data);
};

export const updateExternalLink = (id: string, data: ExternalLinkRequestDto) => {
  return privateInstance<ExternalLinkResponseDto>({ method: 'PUT', url: `product/v1/tools/update/${encodeURIComponent(id)}`, data }).then((res) => res.data);
};

export const deleteExternalLink = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `product/v1/tools/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
