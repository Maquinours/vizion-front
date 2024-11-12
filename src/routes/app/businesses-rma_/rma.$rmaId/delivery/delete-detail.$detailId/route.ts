import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma_/rma/$rmaId/delivery/delete-detail/$detailId')({
  loader: async ({ context: { queryClient }, params: { rmaId, detailId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    const detail = rma.assistanceDelivery?.details?.find((detail) => detail.id === detailId);
    if (!detail) throw notFound();
    return { detail };
  },
  pendingComponent: LoaderModal,
});
