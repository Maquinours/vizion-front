import { createFileRoute, redirect } from '@tanstack/react-router';
import { users } from '../../../../utils/constants/queryKeys/user';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/enterprises/delete-contact/$contactId')({
  beforeLoad: async ({ context: { queryClient }, params: { contactId } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (user.profile.id === contactId) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    queryClient.ensureQueryData(queries.profiles.detail(contactId));
  },
});
