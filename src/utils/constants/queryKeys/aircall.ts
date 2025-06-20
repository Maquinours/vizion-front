import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAircallContactById, getAllAircallCalls, getAllAircallUsers, searchAircallCalls } from '../../api/aircall';

export const aircallQueryKeys = createQueryKeys('aircall', {
  allUsers: {
    queryKey: null,
    queryFn: getAllAircallUsers,
  },
  calls: {
    queryKey: null,
    queryFn: getAllAircallCalls,
    contextQueries: {
      search: ({ from, to, phoneNumber, page, fetchContact }: { from?: Date; to?: Date; phoneNumber?: string; page: number; fetchContact: boolean }) => ({
        queryKey: [from, to, phoneNumber, page, fetchContact],
        queryFn: () => searchAircallCalls({ from, to, phoneNumber, page, fetchContact }),
      }),
    },
  },
  contacts: {
    queryKey: null,
    contextQueries: {
      byId: (id: number) => ({
        queryKey: [id],
        queryFn: () => getAircallContactById(id),
      }),
    },
  },
});
