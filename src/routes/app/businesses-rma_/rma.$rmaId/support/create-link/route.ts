import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryBusiness from '../../../../../../utils/enums/CategoryBusiness';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/support/create-link')({
  loader: ({ context: { queryClient }, params: { rmaId } }) => {
    queryClient.ensureQueryData(queries.rmas.detail(rmaId)).then((rma) => {
      queryClient.prefetchQuery(queries['all-businesses'].list._ctx.notAssociated({ category: CategoryBusiness.RMA, number: rma.number }));
    });
  },
  pendingComponent: LoaderModal,
});
