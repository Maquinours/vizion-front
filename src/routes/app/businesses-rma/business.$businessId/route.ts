import { createFileRoute, redirect } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../utils/constants/queryKeys';
import BusinessState from '../../../../utils/enums/BusinessState';
import CategoryBusiness from '../../../../utils/enums/CategoryBusiness';

const searchSchema = z.object({
  businessModal: z.enum(['archive', 'assistances', 'create-assistance']).optional().catch(undefined),
});

export const Route = createFileRoute('/app/businesses-rma/business/$businessId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { businessModal } }) => ({
    businessModal,
  }),
  loader: async ({ context: { queryClient }, params: { businessId }, deps: { businessModal } }) => {
    const [user, business] = await Promise.all([
      queryClient.ensureQueryData(queries.user.authentified()),
      queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)),
    ]);
    if (
      ((businessModal === 'assistances' || businessModal === 'create-assistance') &&
        !(user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO') && ![BusinessState.DEVIS, BusinessState.ARCHIVE].includes(business.state!))) ||
      (businessModal === 'archive' && !(user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO') && business.state !== BusinessState.ARCHIVE))
    )
      throw redirect({ search: { businessModal: undefined } });

    if (businessModal === 'assistances') {
      const assistances = await queryClient.ensureQueryData(
        queries['technical-supports'].list._ctx.byBusinessOrRmaNumber({ categoryBusiness: CategoryBusiness.AFFAIRE, number: business.numBusiness }),
      );
      if (assistances.length === 0) throw redirect({ search: { businessModal: 'create-assistance' } });
    }
  },
});
