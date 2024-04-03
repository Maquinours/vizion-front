import { privateInstance } from '../functions/axios';
import NewsRequestDto from '../types/NewsRequestDto';
import NewsResponseDto from '../types/NewsResponseDto';
import Page from '../types/Page';

export const createNews = (data: NewsRequestDto) => {
  return privateInstance<NewsResponseDto>({
    method: 'POST',
    url: `/rdv/v1/news/add`,
    data,
  }).then((res) => res.data);
};

export const getNewsPage = (page: number, size: number) => {
  return privateInstance<Page<NewsResponseDto>>({
    method: 'GET',
    url: `/rdv/v1/news/page`,
    params: {
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getNewsById = (id: string) => {
  return privateInstance<NewsResponseDto>({
    method: 'GET',
    url: `/rdv/v1/news/${id}`,
  }).then((res) => res.data);
};

export const updateNews = (id: string, data: NewsRequestDto) => {
  return privateInstance<NewsResponseDto>({
    method: 'PUT',
    url: `/rdv/v1/news/update/${encodeURIComponent(id)}`,
    data,
  }).then((res) => res.data);
};

export const deleteNews = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/rdv/v1/news/${encodeURIComponent(id)}`,
  }).then((res) => res.data);
};
