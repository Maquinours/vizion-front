import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessQuotationByBusinessId } from '../../api/businessQuotations';

export const businessQuotations = createQueryKeys('business-quotations', {
  detail: {
    queryKey: null,
    contextQueries: {
      byBusinessId: (businessId: string) => ({
        queryKey: [businessId],
        queryFn: () => getBusinessQuotationByBusinessId(businessId),
      }),
    },
  },
});
