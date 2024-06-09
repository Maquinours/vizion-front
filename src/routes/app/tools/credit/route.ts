import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  serialNumber: z.string().optional().catch(undefined),
  businessNumber: z.string().optional().catch(undefined),
});

export const Route = createFileRoute('/app/tools/credit')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { serialNumber, businessNumber } }) => ({ serialNumber, businessNumber }),
  loader: ({ context: { queryClient }, deps: { serialNumber, businessNumber } }) => {
    if (!!serialNumber || !!businessNumber) queryClient.prefetchQuery(queries.businesses.detail._ctx.byInfos({ serialNumber, businessNumber }));
  },
  staticData: {
    title: 'Avoir',
  },
});
