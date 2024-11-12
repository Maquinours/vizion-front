import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/create-link')({
  loader: ({ context: { queryClient }, params: { businessId } }) => {
    queryClient.ensureQueryData(queries.businesses.detail._ctx.byId(businessId)).then((business) => {
      queryClient.prefetchQuery(
        queries['all-businesses'].list._ctx.notAssociated({
          category: CategoryBusiness.AFFAIRE,
          number: business.numBusiness,
        }),
      );
    });
  },
  pendingComponent: LoaderModal,
});
