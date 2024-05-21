import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import Page from '../../../../../utils/types/Page';
import DepartmentResponseDto from '../../../../../utils/types/DepartmentResponseDto';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/departments/update/$departmentId')({
  loaderDeps: ({ search: { page } }) => ({ page, size: 15 }),
  loader: async ({ context: { queryClient }, params: { departmentId }, deps: { page, size } }) => {
    await queryClient.ensureQueryData({
      ...queries.departments.detail._ctx.byId(departmentId),
      initialData: () =>
        queryClient
          .getQueryData<Page<DepartmentResponseDto>>(queries.departments.page({ page, size }).queryKey)
          ?.content.find((department) => department.id === departmentId),
      initialDataUpdatedAt: () => queryClient.getQueryState(queries.departments.page({ page, size }).queryKey)?.dataUpdatedAt,
    });
  },
  pendingComponent: LoaderModal,
});
