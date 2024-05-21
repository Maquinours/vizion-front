import { createFileRoute, redirect } from '@tanstack/react-router';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import { users } from '../../../../utils/constants/queryKeys/user';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/create-contact/$enterpriseId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { enterpriseId } }) => {
    queryClient.ensureQueryData(enterprises.detail(enterpriseId));
  },
  pendingComponent: LoaderModal,
});
