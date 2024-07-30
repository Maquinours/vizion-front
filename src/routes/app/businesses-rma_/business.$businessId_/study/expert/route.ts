import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { synopticBusinessQueryKeys } from '../../../../../../utils/constants/queryKeys/synoptic';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/study/expert')({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.profile.expert) throw redirect({ from: Route.id, to: '../automatic', replace: true });
    queryClient.prefetchQuery(synopticBusinessQueryKeys.detail._ctx.byBusinessId(businessId));
    await Promise.all([queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)), queryClient.ensureQueryData(queries.product.list)]);
  },
});
