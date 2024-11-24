import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/rma/$rmaId/support/task-email/$taskId/reply')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    const task = await queryClient.ensureQueryData(queries.tasks.detail(taskId));
    const email = await queryClient.ensureQueryData(queries.emails.detail(task.mailId!));
    return { email };
  },
  pendingComponent: LoaderModal,
});
