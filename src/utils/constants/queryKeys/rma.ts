import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getRmaById } from '../../api/rma';

export const rmas = createQueryKeys('rmas', {
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getRmaById(id),
  }),
});
