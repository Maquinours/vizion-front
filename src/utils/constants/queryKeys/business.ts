import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessById } from '../../api/business';

export const businesses = createQueryKeys('business', {
  detail: (id: string) => ({
    queryKey: [{ id }],
    queryFn: () => getBusinessById(id),
  }),
});
