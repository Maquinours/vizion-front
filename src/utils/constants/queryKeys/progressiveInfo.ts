import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getProgressiveInfoById, getProgressiveInfos } from '../../api/progressiveInfo';

export const progressiveInfos = createQueryKeys('progressive-infos', {
  list: {
    queryKey: null,
    queryFn: getProgressiveInfos,
  },
  detail: (id: string) => ({
    queryKey: [id],
    queryFn: () => getProgressiveInfoById(id),
  }),
});
