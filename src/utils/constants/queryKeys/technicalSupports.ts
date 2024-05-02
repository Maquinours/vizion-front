import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getTechnicalSupportsByBusinessOrRmaNumber } from '../../api/technicalSupports';
import CategoryBusiness from '../../enums/CategoryBusiness';

export const technicalSupports = createQueryKeys('technical-supports', {
  list: {
    queryKey: null,
    contextQueries: {
      byBusinessOrRmaNumber: ({ categoryBusiness, number }: { categoryBusiness: CategoryBusiness; number: string }) => ({
        queryKey: [{ categoryBusiness, number }],
        queryFn: () => getTechnicalSupportsByBusinessOrRmaNumber({ categoryBusiness, number }),
      }),
    },
  },
});
