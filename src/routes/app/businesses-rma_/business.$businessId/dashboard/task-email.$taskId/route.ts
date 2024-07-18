import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../../../utils/types/Page';
import TaskResponseDto from '../../../../../../utils/types/TaskResponseDto';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { redirect } from '@tanstack/react-router';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/task-email/$taskId')({
  loader: async ({ context: { queryClient }, params: { taskId } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..', search: true, replace: true });

    let initialDataKey: QueryKey | undefined;

    queryClient.ensureQueryData({
      ...queries.tasks.detail(taskId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<TaskResponseDto>>({ queryKey: queries.tasks.page.queryKey })) {
          const item = value?.content.find((item) => item.id === taskId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined,
    });
  },
  pendingComponent: LoaderModal,
});
