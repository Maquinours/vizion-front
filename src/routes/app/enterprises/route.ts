import { SearchSchemaInput, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import CategoryClient from '../../../utils/enums/CategoryClient';
import { enterprises } from '../../../utils/constants/queryKeys/enterprise';

import { users } from '../../../utils/constants/queryKeys/user';
import { formatPhoneNumber } from 'react-phone-number-input';
const searchSchema = z.object({
  enterprise: z.string().optional().catch(undefined),
  contact: z.string().optional().catch(undefined),
  zipCode: z.string().optional().catch(undefined),
  city: z.string().optional().catch(undefined),
  phoneNumber: z.string().optional().catch(undefined),
  category: z.enum(CategoryClient).optional().catch(undefined),
  representativeId: z.uuid().optional().catch(undefined),
  fuzzy: z.boolean().catch(true),
  page: z.number().int().min(0).catch(0),
  linkToBusinessId: z.uuid().optional().catch(undefined),
});

export const Route = createFileRoute('/app/enterprises')({
  validateSearch: (
    data: {
      enterprise?: string;
      contact?: string;
      zipCode?: string;
      city?: string;
      phoneNumber?: string;
      category?: CategoryClient;
      representativeId?: string;
      fuzzy?: boolean;
      page?: number;
      linkToBusinessId?: string;
    } & SearchSchemaInput,
  ) => searchSchema.parse(data),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());

    if (!user.userInfo.roles.some((role) => ['ROLE_MEMBRE_VIZEO', 'ROLE_REPRESENTANT', 'ROLE_DISTRIBUTEUR'].includes(role))) throw redirect({ to: '/app' });
  },
  loaderDeps: ({ search: { enterprise, contact, zipCode, city, phoneNumber, category, representativeId, fuzzy, page } }) => ({
    enterprise,
    contact,
    zipCode,
    city,
    phoneNumber,
    category,
    representativeId,
    fuzzy,
    page,
  }),
  loader: ({ context: { queryClient }, deps: { enterprise, contact, zipCode, city, phoneNumber, category, representativeId, fuzzy, page } }) => {
    const size = 20;
    queryClient.prefetchQuery(
      enterprises.page({
        enterprise,
        contact,
        zipCode,
        city,
        phoneNumbers: phoneNumber ? [phoneNumber, formatPhoneNumber(phoneNumber)] : undefined,
        category,
        representativeId,
        fuzzy,
        page,
        size,
      }),
    );
    queryClient.prefetchQuery(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));
  },
  staticData: {
    title: 'Entreprises',
  },
});
