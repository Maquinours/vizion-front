import { createFileRoute, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { users } from '../../../../utils/constants/queryKeys/user';

export const Route = createFileRoute('/app/dashboard/update-aircall-contact/$contactId')({
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..' });
  },
  pendingComponent: LoaderModal,
});
