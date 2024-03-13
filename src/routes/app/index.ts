import { createFileRoute, redirect } from '@tanstack/react-router';
import { getAuthentifiedUser } from '../../views/App/utils/api/authentifiedUser';
import TaskState from '../../utils/enums/TaskState';
import { Views } from 'react-big-calendar';

export const Route = createFileRoute('/app/')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData({ queryKey: ['authentified-user'], queryFn: getAuthentifiedUser });
    if (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
      throw redirect({
        from: Route.id,
        to: './dashboard',
        search: (old) => ({
          ...old,
          personalTaskState: TaskState.CREATED,
          personalTaskPage: 0,
          personalTaskSize: 10,
          schedulerView: Views.DAY,
          schedulerDate: new Date(),
        }),
        replace: true,
      });
  },
});
