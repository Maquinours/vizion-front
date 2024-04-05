import { createFileRoute, redirect } from '@tanstack/react-router';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../utils/api/profile';
import { users } from '../../../../utils/constants/queryKeys/user';

export const Route = createFileRoute('/app/enterprises/create-contact-travel-voucher/$contactId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    queryClient.ensureQueryData({
      queryKey: profileQueryKeys.detailById(contactId),
      queryFn: () => getProfileById(contactId),
    });
  },
});
