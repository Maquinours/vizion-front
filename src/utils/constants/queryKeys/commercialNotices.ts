import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getCommercialNoticesByProductReferences } from '../../api/commercialNotices';

export const commercialNotices = createQueryKeys('commercial-notices', {
  data: {
    queryKey: null,
    contextQueries: {
      byProductReferences: (references: Array<string>) => ({
        queryKey: [references],
        queryFn: () => getCommercialNoticesByProductReferences(references),
      }),
    },
  },
});
