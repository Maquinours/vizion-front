import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../utils/enums/CategoryClient';

export const Route = createFileRoute('/app/dashboard/transfer-task/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    await Promise.all([
      queryClient.ensureQueryData(queries.tasks.detail(taskId)),
      queryClient.ensureQueryData(queries.enterprise.list._ctx.byCategory(CategoryClient.VIZEO)._ctx.profiles._ctx.list),
    ]);
  },
});
