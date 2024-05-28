import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getTechnicalSupportRecapOptionsByTechnicalSupportId } from '../../api/technicalSupportRecapOptions';

export const technicalSupportRecapOptionsQueryKeys = createQueryKeys('technical-support-recap-options', {
  list: {
    queryKey: null,
    contextQueries: {
      byTechnicalSupportId: (technicalSupportId: string) => ({
        queryKey: [technicalSupportId],
        queryFn: () => getTechnicalSupportRecapOptionsByTechnicalSupportId(technicalSupportId),
      }),
    },
  },
});
