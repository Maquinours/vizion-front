import { createQueryKeys } from '@lukemorales/query-key-factory';
import { getBusinessBpSerialById } from '../../api/businessBpSerials';

export const businessBpSerials = createQueryKeys('business-bp-serials', {
  detail: {
    queryKey: null,
    contextQueries: {
      byId: (id: string) => ({
        queryKey: [id],
        queryFn: () => getBusinessBpSerialById(id),
      }),
    },
  },
});
