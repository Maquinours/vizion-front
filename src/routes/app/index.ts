import { createFileRoute, redirect } from '@tanstack/react-router';
import { users } from '../../utils/constants/queryKeys/user';

export const Route = createFileRoute('/app/')({
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
      throw redirect({
        from: Route.id,
        to: 'dashboard',
        search: true,
        replace: true,
      });
    else
      throw redirect({
        from: Route.id,
        to: 'businesses-rma',
        search: true,
        replace: true,
      });
  },
});
