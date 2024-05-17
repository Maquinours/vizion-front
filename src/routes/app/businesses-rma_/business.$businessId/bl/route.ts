import { SearchSchemaInput, createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/bl')({
  validateSearch: (data: { page?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    await queryClient.ensureQueryData(queries['business-bls'].list._ctx.byBusinessId(businessId));
  },
});
