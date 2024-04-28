import { createFileRoute, defer, redirect } from '@tanstack/react-router';
import { Views } from 'react-big-calendar';
import { z } from 'zod';
import { queries } from '../../../utils/constants/queryKeys';
import { keycloakEvents } from '../../../utils/constants/queryKeys/keycloakEvent';
import { users } from '../../../utils/constants/queryKeys/user';
import TaskState from '../../../utils/enums/TaskState';
import WorkloadType from '../../../utils/enums/WorkloadType';

const searchSchema = z.object({
  personalTaskState: z.nativeEnum(TaskState).catch(TaskState.CREATED),
  personalTaskPage: z.number().int().min(0).default(0),
  schedulerView: z.enum([Views.DAY, Views.WORK_WEEK]).catch(Views.DAY),
  schedulerDate: z.coerce.date().catch(new Date()),
});

export const Route = createFileRoute('/app/dashboard')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
      console.warn('User is not allowed to access this route', user, Route);
      throw redirect({ to: '..' });
    }
  },
  loaderDeps: ({ search: { personalTaskState, personalTaskPage } }) => ({ personalTaskState, personalTaskPage, personalTaskSize: 10 }),
  loader: async ({ context: { queryClient }, deps: { personalTaskState, personalTaskPage, personalTaskSize } }) => {
    queryClient.prefetchQuery(keycloakEvents.page({ page: 0, size: 100 }));
    const collectiveTasksPromise = queryClient.ensureQueryData(queries.tasks.list._ctx.byType(WorkloadType.COLLECTIVE));
    const schedulerPromise = queryClient.ensureQueryData(queries['rdv-user-infos'].list);
    const progressiveInfosPromise = queryClient.ensureQueryData(queries['progressive-infos'].list);
    const user = await queryClient.ensureQueryData(users.authentified());
    const personalTaskPromise = queryClient.ensureQueryData(
      queries.tasks.page._ctx.byStateAndProfileId(personalTaskState, user.profile.id, { page: personalTaskPage, size: personalTaskSize }),
    );

    return {
      collectiveTasks: defer(collectiveTasksPromise),
      scheduler: await schedulerPromise,
      progressiveInfos: defer(progressiveInfosPromise),
      personalTask: defer(personalTaskPromise),
    };
  },
  validateSearch: searchSchema,
  staticData: {
    title: 'Tableau de bord',
  },
});
