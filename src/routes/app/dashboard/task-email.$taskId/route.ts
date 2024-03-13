import { createFileRoute, notFound } from '@tanstack/react-router';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../utils/api/task';
import { emailQueryKeys } from '../../../../utils/constants/queryKeys/email';
import { getEmailById } from '../../../../utils/api/email';

export const Route = createFileRoute('/app/dashboard/task-email/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    const task = await queryClient.ensureQueryData({
      queryKey: taskQueryKeys.detailById(taskId),
      queryFn: () => getTaskById(taskId),
    });
    const emailId = task.mailId;
    if (!emailId) throw notFound();

    const email = await queryClient.ensureQueryData({
      queryKey: emailQueryKeys.detailById(emailId),
      queryFn: () => getEmailById(emailId),
    });

    return { task, email };
  },
});
