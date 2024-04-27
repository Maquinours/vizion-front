import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessQuotationDetailById } from '../../api/businessQuotationDetails';

export const businessQuotationDetails = createQueryKeys('business-quotation-details', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getBusinessQuotationDetailById(id),
      }),
    },
  },
});
