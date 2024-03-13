import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import TaskState from '../../../../utils/enums/TaskState';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../utils/api/profile';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import { getPaginatedTasksByStateAndProfileId } from '../../../../utils/api/task';
import { defer } from '@tanstack/react-router';

const searchSchema = z.object({
  otherPersonalTaskState: z.nativeEnum(TaskState).catch(TaskState.CREATED),
  otherPersonalTaskSize: z.number().int().min(10).max(10).catch(10),
  otherPersonalTaskPage: z.number().int().min(0).catch(0),
});

export const Route = createFileRoute('/app/dashboard/other-personal-tasks/$profileId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { otherPersonalTaskState, otherPersonalTaskPage, otherPersonalTaskSize } }) => ({
    state: otherPersonalTaskState,
    page: otherPersonalTaskPage,
    size: otherPersonalTaskSize,
  }),
  loader: async ({ context: { queryClient }, params: { profileId }, deps: { state, page, size } }) => {
    const profilePromise = queryClient.ensureQueryData({ queryKey: profileQueryKeys.detailById(profileId), queryFn: () => getProfileById(profileId) });
    const dataPromise = queryClient.ensureQueryData({
      queryKey: taskQueryKeys.pageByStateAndProfileId(state, profileId, page, size),
      queryFn: () => getPaginatedTasksByStateAndProfileId(state, profileId, page, size),
    });

    return {
      profile: await profilePromise,
      data: defer(dataPromise),
    };
  },
});
