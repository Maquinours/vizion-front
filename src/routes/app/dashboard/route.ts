import { createFileRoute, defer, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import TaskState from '../../../utils/enums/TaskState';
import { Views } from 'react-big-calendar';
import { getAuthentifiedUser } from '../../../views/App/utils/api/authentifiedUser';
import WorkloadType from '../../../utils/enums/WorkloadType';
import { taskQueryKeys } from '../../../utils/constants/queryKeys/task';
import { getPaginatedTasksByStateAndProfileId, getTasksByType } from '../../../utils/api/task';
import { keycloakEventQueryKeys } from '../../../utils/constants/queryKeys/keycloakEvent';
import { getLatestKeycloakEvents } from '../../../views/App/views/Dashboard/components/LatestConnections/utils/api/keycloakEvents';
import { rdvUserInfosQueryKeys } from '../../../utils/constants/queryKeys/rdvUserInfo';
import { getAllRdvUserInfos } from '../../../utils/api/rdvUserInfo';
import { progressiveInfoQueryKeys } from '../../../utils/constants/queryKeys/progressiveInfo';
import { getProgressiveInfos } from '../../../utils/api/progressiveInfo';

const searchSchema = z.object({
  personalTaskState: z.nativeEnum(TaskState).catch(TaskState.CREATED),
  personalTaskPage: z.number().int().min(0).default(0),
  personalTaskSize: z.number().int().min(10).max(10).catch(10),
  schedulerView: z.enum([Views.DAY, Views.WORK_WEEK]).catch(Views.DAY),
  schedulerDate: z.coerce.date().catch(new Date()),
});

export const Route = createFileRoute('/app/dashboard')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData({
      queryKey: ['authentified-user'],
      queryFn: getAuthentifiedUser,
    });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
      console.warn('User is not allowed to access this route', user, Route);
      throw redirect({ to: '..' });
    }
  },
  loaderDeps: ({ search: { personalTaskState, personalTaskPage, personalTaskSize } }) => ({ personalTaskState, personalTaskPage, personalTaskSize }),
  loader: async ({ context: { queryClient }, deps: { personalTaskState, personalTaskPage, personalTaskSize } }) => {
    const keycloakEventsPromise = queryClient.ensureQueryData({
      queryKey: keycloakEventQueryKeys.page(0, 100),
      queryFn: () => getLatestKeycloakEvents(0, 100),
    });
    const collectiveTasksPromise = queryClient.ensureQueryData({
      queryKey: taskQueryKeys.listByType(WorkloadType.COLLECTIVE),
      queryFn: () => getTasksByType(WorkloadType.COLLECTIVE),
    });
    const schedulerPromise = queryClient.ensureQueryData({
      queryKey: rdvUserInfosQueryKeys.listAll(),
      queryFn: getAllRdvUserInfos,
    });
    const progressiveInfosPromise = queryClient.ensureQueryData({
      queryKey: progressiveInfoQueryKeys.listAll(),
      queryFn: getProgressiveInfos,
    });
    const user = await queryClient.ensureQueryData({
      queryKey: ['authentified-user'],
      queryFn: getAuthentifiedUser,
    });
    const personalTaskPromise = queryClient.ensureQueryData({
      queryKey: taskQueryKeys.pageByStateAndProfileId(personalTaskState, user.profile.id, personalTaskPage, personalTaskSize),
      queryFn: () => getPaginatedTasksByStateAndProfileId(personalTaskState, user.profile.id, personalTaskPage, personalTaskSize),
    });

    return {
      collectiveTasks: defer(collectiveTasksPromise),
      keycloakEvents: defer(keycloakEventsPromise),
      scheduler: await schedulerPromise,
      progressiveInfos: defer(progressiveInfosPromise),
      personalTask: defer(personalTaskPromise),
    };
  },
  validateSearch: searchSchema,
});
