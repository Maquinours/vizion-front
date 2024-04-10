import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAuthentifiedUser } from '../../../views/App/utils/api/authentifiedUser';

export const users = createQueryKeys('user', {
  authentified: () => ({ queryKey: ['authentified'], queryFn: getAuthentifiedUser }),
});
