import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { getPaginatedTasksByStateAndProfileId } from '../../../../utils/api/task';
import { queries } from '../../../../utils/constants/queryKeys';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import TaskState from '../../../../utils/enums/TaskState';

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
    queryClient.prefetchQuery({
      queryKey: taskQueryKeys.pageByStateAndProfileId(state, profileId, page, size),
      queryFn: () => getPaginatedTasksByStateAndProfileId(state, profileId, page, size),
    });

    await queryClient.ensureQueryData(queries.profiles.detail(profileId));
  },
});
