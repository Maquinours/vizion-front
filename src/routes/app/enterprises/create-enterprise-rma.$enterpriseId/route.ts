import { createFileRoute, redirect } from '@tanstack/react-router';
import enterpriseQueryKeys from '../../../../utils/constants/queryKeys/enterprise';
import { getEnterpriseById } from '../../../../utils/api/enterprise';
import { users } from '../../../../utils/constants/queryKeys/user';

export const Route = createFileRoute('/app/enterprises/create-enterprise-rma/$enterpriseId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT'].includes(role)))
      throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { enterpriseId } }) => {
    queryClient.ensureQueryData({
      queryKey: enterpriseQueryKeys.detailById(enterpriseId),
      queryFn: () => getEnterpriseById(enterpriseId),
    });
  },
});
