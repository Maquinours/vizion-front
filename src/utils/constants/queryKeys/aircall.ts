import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllAircallCalls, getAllAircallUsers, searchAircallCalls } from '../../api/aircall';

export const aircallQueryKeys = createQueryKeys('aircall', {
  allUsers: {
    queryKey: null,
    queryFn: getAllAircallUsers,
  },
  calls: {
    queryKey: null,
    queryFn: getAllAircallCalls,
    contextQueries: {
      search: ({ from, to, phoneNumber, page }: { from?: Date; to?: Date; phoneNumber?: string; page: number }) => ({
        queryKey: [from, to, phoneNumber, page],
        queryFn: () => searchAircallCalls({ from, to, phoneNumber, page }),
      }),
    },
  },
});
