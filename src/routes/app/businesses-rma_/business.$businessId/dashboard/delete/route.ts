import { createFileRoute, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../utils/constants/queryKeys';
import BusinessState from '../../../../../../utils/enums/BusinessState';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/dashboard/delete')({
  loader: async ({ context: { queryClient }, params: { businessId } }) => {
    const business = await queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId));
    if (!((business.state === BusinessState.DEVIS || business.state === BusinessState.CREATED) && !business.archived))
      throw redirect({ from: Route.id, to: '..', search: true, replace: true });
  },
  pendingComponent: LoaderModal,
});
