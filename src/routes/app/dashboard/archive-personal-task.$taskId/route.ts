import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/dashboard/archive-personal-task/$taskId')({
  loader: ({ context: { queryClient }, params: { taskId } }) => queryClient.ensureQueryData(queries.tasks.detail(taskId)),
});
