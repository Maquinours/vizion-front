import { createFileRoute, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/send-email')({
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '..', search: true, replace: true });
  },
  pendingComponent: LoaderModal,
});
