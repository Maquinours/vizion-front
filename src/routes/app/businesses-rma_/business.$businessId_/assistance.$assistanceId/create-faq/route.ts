import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/create-faq')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(queries.product.list);
  },
  pendingComponent: LoaderModal,
});
