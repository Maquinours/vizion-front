import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getEmailById } from '../../api/email';
import { getEmailsPage, getEmailsPageByType, getEmailsPageWithSearch } from '../../api/emails';
import MailType from '../../enums/MailType';

export const emails = createQueryKeys('emails', {
  detail: (id: string) => ({ queryKey: [{ id }], queryFn: () => getEmailById(id) }),
  page: {
    queryKey: null,
    contextQueries: {
      bySpamStateAndSearch: (spam: boolean, searchText: string | undefined, { page, size }: { page: number; size: number }) => ({
        // eslint-disable-next-line @tanstack/query/exhaustive-deps
        queryKey: [spam, searchText, page, size],
        queryFn: () => {
          if (searchText) return getEmailsPageWithSearch(spam ? [MailType.SPAM] : [MailType.ENVOIE, MailType.RECEPTION], searchText, page, size);
          if (spam) return getEmailsPageByType(MailType.SPAM, page, size);
          return getEmailsPage(page, size);
        },
      }),
    },
  },
});
