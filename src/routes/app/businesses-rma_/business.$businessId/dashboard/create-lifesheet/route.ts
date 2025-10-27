import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/create-lifesheet')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.fullPath, to: '..', search: true });
  },
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId))
    queryClient.prefetchQuery(queries.profiles.list._ctx.byEnterpriseId(business.enterpriseId));
  },
  pendingComponent: LoaderModal,
});
