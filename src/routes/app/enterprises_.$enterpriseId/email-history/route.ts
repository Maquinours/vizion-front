import { createFileRoute, SearchSchemaInput } from '@tanstack/react-router';
import { users } from '../../../../utils/constants/queryKeys/user';
import { redirect } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import _ from 'lodash';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { z } from 'zod';

const searchSchema = z.object({
  addresses: z.string().array().optional().catch(undefined),
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/email-history')({
  validateSearch: (data: { page?: number; addresses?: string[] } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { page, addresses } }) => ({ page, size: 15, addresses }),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.fullPath, to: '../..', search: true });
  },
  loader: async ({ context: { queryClient }, params: { enterpriseId }, deps: { page, size, addresses } }) => {
    const enterprise = await queryClient.ensureQueryData(queries.enterprise.detail(enterpriseId));
    if (!addresses) {
      const newAddresses = _.uniq(
        [enterprise.email, ...enterprise.profiles.map((profile) => profile.email)]
          .filter((address): address is string => !!address)
          .map((address) => address.toLowerCase()),
      );
      throw redirect({ from: Route.fullPath, search: (old) => ({ ...old, addresses: newAddresses }) });
    }
    queryClient.prefetchQuery(queries.emails.page._ctx.byEmailAddresses(addresses, { page, size }));
  },
  pendingComponent: LoaderModal,
});
