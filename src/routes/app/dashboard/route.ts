import { SearchSchemaInput, createFileRoute, redirect } from '@tanstack/react-router';
import { Views } from 'react-big-calendar';
import { z } from 'zod';
// import { queries } from '../../../utils/constants/queryKeys';
// import { keycloakEvents } from '../../../utils/constants/queryKeys/keycloakEvent';
import { users } from '../../../utils/constants/queryKeys/user';
import TaskState from '../../../utils/enums/TaskState';
// import WorkloadType from '../../../utils/enums/WorkloadType';

const searchSchema = z.object({
  personalTaskState: z.nativeEnum(TaskState).catch(TaskState.CREATED),
  personalTaskPage: z.number().int().min(0).default(0),
  schedulerView: z.enum([Views.DAY, Views.WORK_WEEK]).catch(Views.DAY),
  schedulerDate: z.coerce.date().catch(new Date()),
});

export const Route = createFileRoute('/app/dashboard')({
  validateSearch: (
    data: { personalTaskState?: TaskState; personalTaskPage?: number; schedulerView?: 'day' | 'work_week'; schedulerDate?: Date } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
      console.warn('User is not allowed to access this route', user, Route);
      throw redirect({ to: '..' });
    }
  },
  // loaderDeps: ({ search: { personalTaskState, personalTaskPage } }) => ({ personalTaskState, personalTaskPage, personalTaskSize: 10 }),
  // loader: async ({ context: { queryClient }, deps: { personalTaskState, personalTaskPage, personalTaskSize } }) => {
  //   queryClient.prefetchQuery(keycloakEvents.page({ page: 0, size: 100 }));
  //   queryClient.prefetchQuery(queries.tasks.list._ctx.byType(WorkloadType.COLLECTIVE));
  //   queryClient.prefetchQuery(queries['rdv-user-infos'].list);
  //   queryClient.prefetchQuery(queries['progressive-infos'].list);
  //   const user = await queryClient.ensureQueryData(users.authentified());
  //   queryClient.prefetchQuery(
  //     queries.tasks.page._ctx.byStateAndProfileId(personalTaskState, user.profile.id, { page: personalTaskPage, size: personalTaskSize }),
  //   );
  // },
  staticData: {
    title: 'Tableau de bord',
  },
});
