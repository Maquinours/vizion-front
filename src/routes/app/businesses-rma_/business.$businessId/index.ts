import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import BusinessState from '../../../../utils/enums/BusinessState';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/')({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    switch (business.state) {
      case BusinessState.CREATED:
      case BusinessState.FACTURE:
        throw redirect({ from: Route.id, to: 'dashboard', replace: true });
      case BusinessState.DEVIS:
        throw redirect({ from: Route.id, to: 'quotation', replace: true });
      case BusinessState.ARC:
        throw redirect({ from: Route.id, to: 'arc', replace: true });
      case BusinessState.BP:
        throw redirect({ from: Route.id, to: 'bp', replace: true });
      case BusinessState.BL:
        throw redirect({ from: Route.id, to: 'bl', replace: true });
      default:
        throw redirect({ from: Route.id, to: 'dashboard', replace: true });
    }
  },
});
