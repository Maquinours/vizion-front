import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import AppLayout from '../views/App/App';
import { getToken } from '../utils/functions/token';
import { getAuthentifiedUser } from '../views/App/utils/api/authentifiedUser';

const searchSchema = z.object({
  showMobileMenu: z.boolean().catch(false),
});

export const Route = createFileRoute('/app')({
  validateSearch: searchSchema,
  beforeLoad: () => {
    const token = getToken();
    if (!token)
      throw redirect({
        to: '/auth/login',
      });
  },
  loader: ({ context: { queryClient } }) =>
    queryClient.ensureQueryData({
      queryKey: ['authentified-user'],
      queryFn: getAuthentifiedUser,
    }),
  component: AppLayout,
});
