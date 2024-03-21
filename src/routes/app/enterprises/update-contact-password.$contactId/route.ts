import { createFileRoute, redirect } from '@tanstack/react-router';
import { getAuthentifiedUser } from '../../../../views/App/utils/api/authentifiedUser';
import { profileQueryKeys } from '../../../../utils/constants/queryKeys/profile';
import { getProfileById } from '../../../../utils/api/profile';
import CategoryClient from '../../../../utils/enums/CategoryClient';

export const Route = createFileRoute('/app/enterprises/update-contact-password/$contactId')({
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    const userPromise = queryClient.ensureQueryData({
      queryKey: ['authentified-user'],
      queryFn: getAuthentifiedUser,
    });

    const contactPromise = queryClient.ensureQueryData({
      queryKey: profileQueryKeys.detailById(contactId),
      queryFn: () => getProfileById(contactId),
    });

    const [user, contact] = await Promise.all([userPromise, contactPromise]);

    if (
      !(
        user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') ||
        (user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && (contact.categoryClient !== CategoryClient.VIZEO || user.profile.id === contact.id))
      )
    )
      throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
});
