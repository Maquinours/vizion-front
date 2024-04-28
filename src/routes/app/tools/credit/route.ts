import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  serialNumber: z.string().optional().catch(undefined),
  businessNumber: z.string().optional().catch(undefined),
  orderNumber: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/app/tools/credit')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { serialNumber, businessNumber, orderNumber } }) => ({ serialNumber, businessNumber, orderNumber }),
  loader: ({ context: { queryClient }, deps: { serialNumber, businessNumber, orderNumber } }) => {
    if (!!serialNumber || !!businessNumber || !!orderNumber)
      queryClient.prefetchQuery(queries.businesses.detail._ctx.byInfos({ serialNumber, businessNumber, orderNumber }));
  },
  staticData: {
    title: 'Avoir',
  },
});
