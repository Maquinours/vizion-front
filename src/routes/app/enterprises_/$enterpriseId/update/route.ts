import { createFileRoute, defer } from '@tanstack/react-router';
import { departmentQueryKeys } from '../../../../../utils/constants/queryKeys/department';
import { getAllDepartments } from '../../../../../utils/api/department';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update')({
  loader: ({ context: { queryClient } }) =>
    defer(
      queryClient.ensureQueryData({
        queryKey: departmentQueryKeys.listAll(),
        queryFn: getAllDepartments,
      }),
    ),
});
