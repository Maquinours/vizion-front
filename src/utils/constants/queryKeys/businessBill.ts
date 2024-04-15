import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessBillsByBusinessId } from '../../api/businessBill';

export const businessBills = createQueryKeys('business-bills', {
  list: {
    queryKey: null,
    contextQueries: {
      byBusinessId: (businessId: string) => ({ queryKey: [{ businessId }], queryFn: () => getBusinessBillsByBusinessId(businessId) }),
    },
  },
});
