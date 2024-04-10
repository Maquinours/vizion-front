import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import { emails } from '../../../../utils/constants/queryKeys/email';

export const Route = createFileRoute('/app/dashboard/task-email/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    const task = await queryClient.ensureQueryData(queries.tasks.detail(taskId));
    const emailId = task.mailId;
    if (!emailId) throw notFound();

    await queryClient.ensureQueryData(emails.detail(emailId));
  },
});
