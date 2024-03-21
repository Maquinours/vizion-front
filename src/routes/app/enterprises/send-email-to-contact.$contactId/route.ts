import { createFileRoute, redirect } from '@tanstack/react-router';
import { getAuthentifiedUser } from '../../../../views/App/utils/api/authentifiedUser';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../utils/api/profile';

export const Route = createFileRoute('/app/enterprises/send-email-to-contact/$contactId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData({ queryKey: ['authentified-user'], queryFn: getAuthentifiedUser });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    const contact = await queryClient.ensureQueryData({
      queryKey: profileQueryKeys.detailById(contactId),
      queryFn: () => getProfileById(contactId),
    });
    if (!contact.email) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
});
