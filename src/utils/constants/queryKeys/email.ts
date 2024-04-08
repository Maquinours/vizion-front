import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getEmailById } from '../../api/email';

export const emails = createQueryKeys('emails', {
  detail: (id: string) => ({ queryKey: [{ id }], queryFn: () => getEmailById(id) }),
});
