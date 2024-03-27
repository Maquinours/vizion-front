import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { getAuthentifiedUser } from '../../../../../views/App/utils/api/authentifiedUser';

const searchSchema = z.object({
  gedObjectRelativePath: z.string(),
});

export const Route = createFileRoute('/app/products/$productId/informations/create-ged-directory')({
  validateSearch: searchSchema,
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData({ queryKey: ['authentified-user'], queryFn: getAuthentifiedUser });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO'))
      throw redirect({ from: Route.id, to: '..', search: ({ lifesheetPage }) => ({ lifesheetPage }), replace: true });
  },
});
