import FaqAccessLevel from '../enums/FaqAccessLevel';
import { privateInstance } from '../functions/axios';
import FaqRequestDto from '../types/FaqRequestDto';
import FaqResponseDto from '../types/FaqResponseDto';
import Page from '../types/Page';

export const getFaqsPageByArchiveState = (archived: boolean, page: number, size: number) => {
  return privateInstance<Page<FaqResponseDto>>({
    method: 'GET',
    url: `product/v1/faq/list/archive-state/page`,
    params: {
      archived,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getFaqsPageByArchiveStateWithSearch = (
  archived: boolean,
  searchText: string | undefined,
  productId: string | undefined,
  accessLevel: FaqAccessLevel | undefined,
  fuzzy: boolean,
  titleOnly: boolean,
  page: number,
  size: number,
) => {
  return privateInstance<Page<FaqResponseDto>>({
    method: 'GET',
    url: `product/v1/faq/search-page/${encodeURIComponent(page)}/${encodeURIComponent(size)}`,
    params: {
      archived,
      searchText,
      productId,
      accessLevel,
      fuzzy,
      titleOnly,
    },
  }).then((res) => res.data);
};

export const createFaq = (data: FaqRequestDto) => {
  return privateInstance<FaqResponseDto>({
    method: 'POST',
    url: `product/v1/faq/add`,
    data,
  }).then((res) => res.data);
};

export const getFaqById = (id: string) => {
  return privateInstance<FaqResponseDto>({
    method: 'GET',
    url: `product/v1/faq/find-by-id/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};

export const updateFaq = (id: string, data: FaqRequestDto) => {
  return privateInstance<FaqResponseDto>({
    method: 'PUT',
    url: `product/v1/faq/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteFaq = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `product/v1/faq/delete/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
