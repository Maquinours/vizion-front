import MailType from '../enums/MailType';
import { privateInstance } from '../functions/axios';
import MailResponseDto from '../types/MailResponseDto';
import Page from '../types/Page';

export const getEmailsPage = (page: number, size: number) => {
  return privateInstance<Page<MailResponseDto>>({
    method: 'GET',
    url: `/mail/v1/list-mails`,
    params: {
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getEmailsPageByType = (type: MailType, page: number, size: number) => {
  return privateInstance<Page<MailResponseDto>>({
    method: 'GET',
    url: `/mail/v1/list-mail-by-type`,
    params: {
      type,
      page,
      size,
    },
  }).then((res) => res.data);
};

export const getEmailsPageWithSearch = (types: Array<MailType>, searchText: string, page: number, size: number) => {
  return privateInstance<Page<MailResponseDto>>({
    method: 'GET',
    url: `/mail/v1/search`,
    params: {
      type: types,
      searchText,
      page,
      size,
    },
  }).then((res) => res.data);
};
