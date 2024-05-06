import { privateInstance } from '../functions/axios';
import MailPaperRequestDto from '../types/MailPaperRequestDto';
import MailPaperResponseDto from '../types/MailPaperResponseDto';
import Page from '../types/Page';

export const getMailsPage = ({ page, size }: { page: number; size: number }) => {
  return privateInstance<Page<MailPaperResponseDto>>({
    method: 'GET',
    url: `/mail/v1/mail-paper/all-paged`,
    params: {
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getMailsPageWithSearch = (searchText: string, { page, size }: { page: number; size: number }) => {
  return privateInstance<Page<MailPaperResponseDto>>({
    method: 'GET',
    url: `/mail/v1/mail-paper/search-paged`,
    params: {
      searchText,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getMailById = (id: string) => {
  return privateInstance<MailPaperResponseDto>({
    method: 'GET',
    url: '/mail/v1/mail-paper/find-by-id',
    params: {
      id,
    },
  }).then((res) => res.data);
};

export const deleteMail = (id: string) => {
  return privateInstance<void>({
    method: 'DELETE',
    url: `/mail/v1/mail-paper/delete`,
    params: {
      id,
    },
  }).then((res) => res.data);
};

export const createMail = (data: MailPaperRequestDto) => {
  return privateInstance<MailPaperResponseDto>({
    method: 'POST',
    url: `/mail/v1/mail-paper/add`,
    data,
  }).then((res) => res.data);
};

export const updateMail = (id: string, data: MailPaperRequestDto) => {
  return privateInstance<MailPaperResponseDto>({
    method: 'PUT',
    url: `/mail/v1/mail-paper/update`,
    params: {
      id,
    },
    data,
  }).then((res) => res.data);
};
