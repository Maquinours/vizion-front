import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/formations/subscribers/$formationDetailId')({
  loader: ({ context: { queryClient }, params: { formationDetailId } }) => {
    queryClient.prefetchQuery(queries['formation-subscriptions'].list._ctx.byFormationDetailId(formationDetailId));
  },
  pendingComponent: LoaderModal,
});
