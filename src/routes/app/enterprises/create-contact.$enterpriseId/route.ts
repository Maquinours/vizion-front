import { createFileRoute, redirect } from '@tanstack/react-router';
import { getAuthentifiedUser } from '../../../../views/App/utils/api/authentifiedUser';
import enterpriseQueryKeys from '../../../../utils/constants/queryKeys/enterprise';
import { getEnterpriseById } from '../../../../utils/api/enterprise';

export const Route = createFileRoute('/app/enterprises/create-contact/$enterpriseId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData({ queryKey: ['authentified-user'], queryFn: getAuthentifiedUser });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { enterpriseId } }) => {
    queryClient.ensureQueryData({
      queryKey: enterpriseQueryKeys.detailById(enterpriseId),
      queryFn: () => getEnterpriseById(enterpriseId),
    });
  },
});
