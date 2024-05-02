import { SearchSchemaInput, createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';
import { users } from '../../../../utils/constants/queryKeys/user';

const searchSchema = z.object({
  serialNumbersSearch: z.string().optional().catch(undefined),
  serialNumbersPage: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/products/serial-numbers')({
  validateSearch: (data: { serialNumbersSearch?: string; serialNumbersPage?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { serialNumbersPage: page, serialNumbersSearch: search } }) => ({ page, size: 20, search }),
  loader: async ({ context: { queryClient }, deps: { page, size, search } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && !user.profile.expert)
      throw redirect({ from: Route.id, to: '..', search: (old) => ({ ...old, serialNumberSearch: undefined, serialNumbersPage: undefined }) });

    queryClient.ensureQueryData(queries['product-serial-numbers'].page({ page, size })._ctx.search(search));
  },
});
