import { createFileRoute, redirect } from '@tanstack/react-router';
import { users } from '../../../../utils/constants/queryKeys/user';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/delete-contact/$contactId')({
  beforeLoad: async ({ context: { queryClient }, params: { contactId } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (user.profile.id === contactId) throw redirect({ from: Route.id, to: '../..', search: true });
  },
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    queryClient.ensureQueryData(queries.profiles.detail(contactId));
  },
  pendingComponent: LoaderModal,
});
