import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessById, getBusinessByInfos, getBusinesses } from '../../api/business';

export const businesses = createQueryKeys('businesses', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({ queryKey: [{ id }], queryFn: () => getBusinessById(id) }),
      byInfos: ({
        serialNumber,
        businessNumber,
        orderNumber,
      }: {
        serialNumber: string | undefined;
        businessNumber: string | undefined;
        orderNumber: string | undefined;
      }) => ({
        queryKey: [{ serialNumber, businessNumber, orderNumber }],
        queryFn: () => getBusinessByInfos({ serialNumber, businessNumber, orderNumber }),
      }),
    },
  },
  list: {
    queryKey: null,
    contextQueries: {
      all: {
        queryKey: null,
        queryFn: getBusinesses,
      },
    },
  },
});
