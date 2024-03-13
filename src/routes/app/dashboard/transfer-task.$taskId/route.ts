import { createFileRoute } from '@tanstack/react-router';
import { taskQueryKeys } from '../../../../utils/constants/queryKeys/task';
import { getTaskById } from '../../../../utils/api/task';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfilesByCategory } from '../../../../utils/api/profile';
import CategoryClient from '../../../../utils/enums/CategoryClient';

export const Route = createFileRoute('/app/dashboard/transfer-task/$taskId')({
  loader: ({ context: { queryClient }, params: { taskId } }) => {
    const taskPromise = queryClient.ensureQueryData({
      queryKey: taskQueryKeys.detailById(taskId),
      queryFn: () => getTaskById(taskId),
    });
    const membersPromise = queryClient.ensureQueryData({
      queryKey: profileQueryKeys.listByCategory(CategoryClient.VIZEO),
      queryFn: () => getProfilesByCategory(CategoryClient.VIZEO),
    });

    return Promise.all([taskPromise, membersPromise]);
  },
});
