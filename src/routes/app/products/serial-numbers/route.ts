import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { productSerialNumberQueryKeys } from '../../../../utils/constants/queryKeys/productSerialNumber';
import { getProductSerialNumbersPage, getProductSerialNumbersPageWithSearch } from '../../../../utils/api/productSerialNumber';
import { getAuthentifiedUser } from '../../../../views/App/utils/api/authentifiedUser';

const searchSchema = z.object({
  serialNumbersSearch: z.string().optional().catch(undefined),
  serialNumbersPage: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/products/serial-numbers')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { serialNumbersPage: page, serialNumbersSearch: search } }) => ({ page, size: 20, search }),
  loader: async ({ context: { queryClient }, deps: { page, size, search } }) => {
    const user = await queryClient.ensureQueryData({
      queryKey: ['authentified-user'],
      queryFn: getAuthentifiedUser,
    });
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !user.profile.expert)
      throw redirect({ from: Route.id, to: '..', search: (old) => ({ ...old, serialNumberSearch: undefined, serialNumbersPage: undefined }) });

    queryClient.ensureQueryData({
      queryKey: productSerialNumberQueryKeys.pageWithSearch(search, page, 20),
      queryFn: () => (search ? getProductSerialNumbersPageWithSearch(search, page, size) : getProductSerialNumbersPage(page, size)),
    });
  },
});
