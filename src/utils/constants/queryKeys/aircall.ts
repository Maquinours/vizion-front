import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllAircallUsers } from '../../api/aircall';

export const aircallQueryKeys = createQueryKeys('aircall', {
  allUsers: {
    queryKey: null,
    queryFn: getAllAircallUsers,
  },
});
