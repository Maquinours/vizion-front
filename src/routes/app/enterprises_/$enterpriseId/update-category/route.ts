import { createFileRoute, redirect } from '@tanstack/react-router';
import enterpriseQueryKeys from '../../../../../utils/constants/queryKeys/enterprise';
import { getEnterpriseById } from '../../../../../utils/api/enterprise';
import CategoryClient from '../../../../../utils/enums/CategoryClient';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update-category')({
  beforeLoad: async ({ context: { queryClient }, params: { enterpriseId } }) => {
    const enterprise = await queryClient.ensureQueryData({
      queryKey: enterpriseQueryKeys.detailById(enterpriseId),
      queryFn: () => getEnterpriseById(enterpriseId),
    });
    if ([CategoryClient.VIZEO, CategoryClient.FOURNISSEUR, CategoryClient.REPRESENTANT].includes(enterprise.category)) {
      console.warn('Not allowed to access this route', Route, enterprise);
      throw redirect({ from: Route.id, to: '..', search: (old) => old });
    }
  },
});
