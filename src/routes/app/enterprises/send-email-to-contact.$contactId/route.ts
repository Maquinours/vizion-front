import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import { users } from '../../../../utils/constants/queryKeys/user';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/send-email-to-contact/$contactId')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.id, to: '../..', search: true });
  },
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    const contact = await queryClient.ensureQueryData(queries.profiles.detail(contactId));
    if (!contact.email) throw redirect({ from: Route.id, to: '../..', search: true });
  },
  pendingComponent: LoaderModal,
});
