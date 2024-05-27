import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import { users } from '../../../../utils/constants/queryKeys/user';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/update-contact-password/$contactId')({
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    const userPromise = queryClient.ensureQueryData(users.authentified());

    const contactPromise = queryClient.ensureQueryData(queries.profiles.detail(contactId));

    const [user, contact] = await Promise.all([userPromise, contactPromise]);

    if (
      !(
        user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') ||
        (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (contact.categoryClient !== CategoryClient.VIZEO || user.profile.id === contact.id))
      )
    )
      throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  pendingComponent: LoaderModal,
});
