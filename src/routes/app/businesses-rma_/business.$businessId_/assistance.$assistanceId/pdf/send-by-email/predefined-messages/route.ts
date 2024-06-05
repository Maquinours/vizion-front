import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/assistance/$assistanceId/pdf/send-by-email/predefined-messages')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries['predefined-message'].list);
  },
  pendingComponent: LoaderModal,
});
