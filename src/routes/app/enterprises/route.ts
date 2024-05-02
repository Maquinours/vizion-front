import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import CategoryClient from '../../../utils/enums/CategoryClient';
import { enterprises } from '../../../utils/constants/queryKeys/enterprise';

import { users } from '../../../utils/constants/queryKeys/user';
const searchSchema = z.object({
  enterprise: z.string().optional().catch(undefined),
  contact: z.string().optional().catch(undefined),
  zipCode: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  phoneNumber: z.string().optional().catch(undefined),
  category: z.nativeEnum(CategoryClient).optional().catch(undefined),
  representativeId: z.string().uuid().optional().catch(undefined),
  page: z.number().int().min(0).catch(0),
});

export const Route = createFileRoute('/app/enterprises')({
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());

    if (!user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT', 'ROLE_DISTRIBUTEUR'].includes(role))) throw redirect({ to: '/app' });
  },
  loaderDeps: ({ search: { enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page } }) => ({
    enterprise,
    contact,
    zipCode,
    city,
    phoneNumber,
    category,
    representativeId,
    page,
  }),
  loader: ({ context: { queryClient }, deps: { enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page } }) => {
    const size = 20;
    queryClient.ensureQueryData(enterprises.page({ enterprise, contact, zipCode, city, phoneNumber, category, representativeId, page, size }));
    queryClient.ensureQueryData(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));
  },
  validateSearch: searchSchema,
  staticData: {
    title: 'Entreprises',
  },
});
