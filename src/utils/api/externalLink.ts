import { privateInstance } from '../functions/axios';
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
