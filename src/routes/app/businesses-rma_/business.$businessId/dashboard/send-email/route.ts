import { createFileRoute, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/send-email')({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.fullPath, to: '..', search: true, replace: true });
    const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    queryClient.prefetchQuery(queries['predefined-message'].list);

    return { business };
  },
  pendingComponent: LoaderModal,
});
