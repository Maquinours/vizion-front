import { createFileRoute, redirect } from '@tanstack/react-router';
import { users } from '../../../../../utils/constants/queryKeys/user';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/$productId/informations/create-lifesheet-comment')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '..', search: (old) => old, replace: true });
  },
  pendingComponent: LoaderModal,
});
