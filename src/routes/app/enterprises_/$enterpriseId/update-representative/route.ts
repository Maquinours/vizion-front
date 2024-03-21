import { createFileRoute, defer } from '@tanstack/react-router';
import enterpriseQueryKeys from '../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../utils/enums/CategoryClient';
import { getEnterprisesByCategory } from '../../../../../utils/api/enterprises';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update-representative')({
  loader: ({ context: { queryClient } }) =>
    defer(
      queryClient.ensureQueryData({
        queryKey: enterpriseQueryKeys.listByCategory(CategoryClient.REPRESENTANT),
        queryFn: () => getEnterprisesByCategory(CategoryClient.REPRESENTANT),
      }),
    ),
});
