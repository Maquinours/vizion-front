import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/delivery/delete-detail/$detailId')({
  loader: async ({ context: { queryClient }, params: { rmaId, detailId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    const detail = rma.assistanceDelivery?.details?.find((detail) => detail.id === detailId);
    if (!detail) throw notFound();
    return { detail };
  },
});
