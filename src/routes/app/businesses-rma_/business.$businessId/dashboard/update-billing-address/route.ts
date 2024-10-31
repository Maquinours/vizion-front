import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/update-billing-address')({
  beforeLoad: async ({ context: { queryClient }, params: { businessId } }) => {
    const [user, business] = await Promise.all([
      queryClient.ensureQueryData(queries.user.authentified()),
      queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)),
    ]);
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') || business.archived)
      throw redirect({
        from: Route.fullPath,
        to: '..',
        search: (old) => old,
        replace: true,
      });
  },
  pendingComponent: LoaderModal,
});
