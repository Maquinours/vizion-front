import { createFileRoute, defer } from '@tanstack/react-router';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import { getProfilesByCategory } from '../../../../utils/api/profile';

export const Route = createFileRoute('/app/dashboard/create-personal-task')({
  loader: ({ context: { queryClient } }) =>
    defer(
      queryClient.ensureQueryData({
        queryKey: profileQueryKeys.listByCategory(CategoryClient.VIZEO),
        queryFn: () => getProfilesByCategory(CategoryClient.VIZEO),
      }),
    ),
});
