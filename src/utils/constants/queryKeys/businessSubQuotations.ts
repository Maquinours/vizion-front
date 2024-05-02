import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessSubQuotationById } from '../../api/businessSubQuotations';

export const businessSubQuotations = createQueryKeys('business-sub-quotations', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getBusinessSubQuotationById(id),
      }),
    },
  },
});
