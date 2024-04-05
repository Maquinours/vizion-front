import { createFileRoute, redirect } from '@tanstack/react-router';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../utils/api/profile';
import { users } from '../../../../utils/constants/queryKeys/user';

export const Route = createFileRoute('/app/enterprises/delete-contact/$contactId')({
  beforeLoad: async ({ context: { queryClient }, params: { contactId } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (user.profile.id === contactId) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    queryClient.ensureQueryData({
      queryKey: profileQueryKeys.detailById(contactId),
      queryFn: () => getProfileById(contactId),
    });
  },
});
