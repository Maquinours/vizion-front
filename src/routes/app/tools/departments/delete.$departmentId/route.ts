import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import Page from '../../../../../utils/types/Page';
import DepartmentResponseDto from '../../../../../utils/types/DepartmentResponseDto';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/departments/delete/$departmentId')({
  loader: async ({ context: { queryClient }, params: { departmentId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...queries.departments.detail._ctx.byId(departmentId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<DepartmentResponseDto>>({ queryKey: queries.departments.page._def })) {
          const item = value?.content.find((item) => item.id === departmentId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
  pendingComponent: LoaderModal,
});
