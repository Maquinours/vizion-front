import { SearchSchemaInput } from '@tanstack/react-router';
import { createFileRoute } from '@tanstack/react-router';
import { z } from 'zod';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { users } from '../../../../../../utils/constants/queryKeys/user';
import { redirect } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import _ from 'lodash';

const searchSchema = z.object({
  page: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/email-history')({
  validateSearch: (data: { page?: number } & SearchSchemaInput) => searchSchema.parse(data),
  loaderDeps: ({ search: { page } }) => ({ page, size: 15 }),
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(users.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw redirect({ from: Route.fullPath, to: '../..', search: true });
  },
  loader: async ({ context: { queryClient }, params: { businessId }, deps: { page, size } }) => {
    const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    queryClient.prefetchQuery(
      queries.emails.page._ctx.byEmailAddresses(
        _.uniq([business.billingEmail, business.deliverEmail, business.profileEmail].filter((address): address is string => !!address)),
        { page, size },
      ),
    );
  },
  pendingComponent: LoaderModal,
});
