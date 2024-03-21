import { createFileRoute, redirect } from '@tanstack/react-router';
import { getAuthentifiedUser } from '../../../../views/App/utils/api/authentifiedUser';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../utils/api/profile';

export const Route = createFileRoute('/app/enterprises/delete-contact/$contactId')({
  beforeLoad: async ({ context: { queryClient }, params: { contactId } }) => {
    const user = await queryClient.ensureQueryData({ queryKey: ['authentified-user'], queryFn: getAuthentifiedUser });
    if (user.profile.id === contactId) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    queryClient.ensureQueryData({
      queryKey: profileQueryKeys.detailById(contactId),
      queryFn: () => getProfileById(contactId),
    });
  },
});
