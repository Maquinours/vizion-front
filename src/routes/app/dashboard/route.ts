import { createFileRoute, defer, redirect } from '@tanstack/react-router';
import { Views } from 'react-big-calendar';
import { z } from 'zod';
import { getAllRdvUserInfos } from '../../../utils/api/rdvUserInfo';
import { getPaginatedTasksByStateAndProfileId, getTasksByType } from '../../../utils/api/task';
import { queries } from '../../../utils/constants/queryKeys';
import { keycloakEvents } from '../../../utils/constants/queryKeys/keycloakEvent';
import { rdvUserInfosQueryKeys } from '../../../utils/constants/queryKeys/rdvUserInfo';
import { taskQueryKeys } from '../../../utils/constants/queryKeys/task';
import { users } from '../../../utils/constants/queryKeys/user';
import TaskState from '../../../utils/enums/TaskState';
import WorkloadType from '../../../utils/enums/WorkloadType';

const searchSchema = z.object({
  personalTaskState: z.nativeEnum(TaskState).catch(TaskState.CREATED),
  personalTaskPage: z.number().int().min(0).default(0),
  personalTaskSize: z.number().int().min(10).max(10).catch(10),
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
  loaderDeps: ({ search: { personalTaskState, personalTaskPage, personalTaskSize } }) => ({ personalTaskState, personalTaskPage, personalTaskSize }),
  loader: async ({ context: { queryClient }, deps: { personalTaskState, personalTaskPage, personalTaskSize } }) => {
    queryClient.prefetchQuery(keycloakEvents.page({ page: 0, size: 100 }));
    const collectiveTasksPromise = queryClient.ensureQueryData({
      queryKey: taskQueryKeys.listByType(WorkloadType.COLLECTIVE),
      queryFn: () => getTasksByType(WorkloadType.COLLECTIVE),
    });
    const schedulerPromise = queryClient.ensureQueryData({
      queryKey: rdvUserInfosQueryKeys.listAll(),
      queryFn: getAllRdvUserInfos,
    });
    const progressiveInfosPromise = queryClient.ensureQueryData(queries['progressive-infos'].list);
    const user = await queryClient.ensureQueryData(users.authentified());
    const personalTaskPromise = queryClient.ensureQueryData({
      queryKey: taskQueryKeys.pageByStateAndProfileId(personalTaskState, user.profile.id, personalTaskPage, personalTaskSize),
      queryFn: () => getPaginatedTasksByStateAndProfileId(personalTaskState, user.profile.id, personalTaskPage, personalTaskSize),
    });

    return {
      collectiveTasks: defer(collectiveTasksPromise),
      scheduler: await schedulerPromise,
      progressiveInfos: defer(progressiveInfosPromise),
      personalTask: defer(personalTaskPromise),
    };
  },
  validateSearch: searchSchema,
});
