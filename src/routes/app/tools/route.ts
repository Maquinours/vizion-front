import { createFileRoute, redirect } from '@tanstack/react-router';
import { getAuthentifiedUser } from '../../../views/App/utils/api/authentifiedUser';

export const Route = createFileRoute('/app/tools')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData({
      queryKey: ['authentified-user'],
      queryFn: getAuthentifiedUser,
    });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ to: '/app' });
  },
});
