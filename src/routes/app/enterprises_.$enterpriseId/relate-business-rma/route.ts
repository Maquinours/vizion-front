import { createFileRoute, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/relate-business-rma')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.fullPath, to: '..', search: true, replace: true, resetScroll: false });
  },
  loader: ({ context: { queryClient }, params: { enterpriseId } }) => {
    queryClient.prefetchQuery(queries['all-businesses'].list._ctx.notAssociatedByEnterpriseId(enterpriseId));
  },
  pendingComponent: LoaderModal,
});
