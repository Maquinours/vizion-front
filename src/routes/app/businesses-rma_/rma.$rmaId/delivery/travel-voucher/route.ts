import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/delivery/travel-voucher')({
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    return {
      rma: await queryClient.ensureQueryData(queries.rmas.detail(rmaId)),
    };
  },
});
