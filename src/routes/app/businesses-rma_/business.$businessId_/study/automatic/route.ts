import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/study/automatic')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(queries.product.list);
  },
});
