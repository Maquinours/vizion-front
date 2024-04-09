import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getAllRdvUserInfos, getRdvUserInfosByRdvId } from '../../api/rdvUserInfo';

export const rdvUserInfos = createQueryKeys('rdv-user-infos', {
  list: {
    queryKey: null,
    queryFn: getAllRdvUserInfos,
    contextQueries: {
      byRdvId: (rdvId: string) => ({
        queryKey: [rdvId],
        queryFn: () => getRdvUserInfosByRdvId(rdvId),
      }),
    },
  },
});
