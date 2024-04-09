import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getRdvById } from '../../api/rdv';

export const rdvs = createQueryKeys('rdvs', {
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getRdvById(id),
  }),
});
