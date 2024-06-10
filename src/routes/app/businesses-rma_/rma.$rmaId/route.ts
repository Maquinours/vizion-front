import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';

const searchSchema = z.object({
  rmaModal: z.enum(['archive']).optional(),
});

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId')({
  validateSearch: searchSchema,
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
  },
  staticData: {
    getTitle: (queryClient, match) =>
      queryClient.ensureQueryData(queries.rmas.detail((match.params as { rmaId: string }).rmaId)).then((rma) => `RMA (${rma.number})`),
  },
});
