import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/dashboard/validate-personal-task/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    await queryClient.ensureQueryData(queries.tasks.detail(taskId));
  },
});
