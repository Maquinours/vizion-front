import { createFileRoute, notFound } from '@tanstack/react-router';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../utils/api/task';
import { emails } from '../../../../utils/constants/queryKeys/email';

export const Route = createFileRoute('/app/dashboard/task-email/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    const task = await queryClient.ensureQueryData({
      queryKey: taskQueryKeys.detailById(taskId),
      queryFn: () => getTaskById(taskId),
    });
    const emailId = task.mailId;
    if (!emailId) throw notFound();

    await queryClient.ensureQueryData(emails.detail(emailId));
  },
});
