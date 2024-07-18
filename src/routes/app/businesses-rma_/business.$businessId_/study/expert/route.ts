import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/study/expert')({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    await Promise.all([queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)), queryClient.ensureQueryData(queries.product.list)]);
  },
});
