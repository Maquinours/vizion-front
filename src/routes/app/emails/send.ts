import { createFileRoute, redirect } from '@tanstack/react-router';
import SendEmailView from '../../../views/App/views/SendEmail/SendEmail';
import { z } from 'zod';
import { getAuthentifiedUser } from '../../../views/App/utils/api/authentifiedUser';

const searchSchema = z.object({
  sendEmailModal: z.enum(['predefined-messages']).optional().catch(undefined),
});

export const Route = createFileRoute('/app/emails/send')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData({
      queryKey: ['authentified-user'],
      queryFn: getAuthentifiedUser,
    });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) {
      console.warn('User is not allowed to access this route', user, Route);
      throw redirect({ to: '..' });
    }
  },
  validateSearch: searchSchema,
  component: SendEmailView,
});
