import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/update-representative')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO')) throw redirect({ from: Route.id, to: '..', search: (old) => old, replace: true });
  },
  loader: async ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT));
  },
  pendingComponent: LoaderModal,
});
