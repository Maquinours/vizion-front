import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  hideReferencesPrices: z.boolean().catch(false),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/arc')({
  validateSearch: (data: { hideReferencesPrices?: boolean } & SearchSchemaInput) => searchSchema.parse(data),
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    queryClient.prefetchQuery(queries['product-stocks'].list._ctx.all);
    await queryClient.ensureQueryData(queries['business-ARCs'].detail._ctx.byBusinessId(businessId));
  },
});
