import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';
import TaskState from '../../../../utils/enums/TaskState';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

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
    queryClient.prefetchQuery(queries.tasks.page._ctx.byStateAndProfileId(state, profileId, { page, size }));
    queryClient.prefetchQuery(queries.tasks.counts._ctx.byProfileId(profileId));

    await queryClient.ensureQueryData(queries.profiles.detail._ctx.byId(profileId));
  },
  pendingComponent: LoaderModal,
});
