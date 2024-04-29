import { createFileRoute, redirect } from '@tanstack/react-router';
import { users } from '../../utils/constants/queryKeys/user';

export const Route = createFileRoute('/app/')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
      throw redirect({
        from: Route.id,
        to: 'dashboard',
        search: (old) => old,
        replace: true,
      });
  },
});
