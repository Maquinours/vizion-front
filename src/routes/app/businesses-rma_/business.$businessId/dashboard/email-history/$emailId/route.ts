import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/email-history/$emailId')({
  loader: async ({ context: { queryClient }, params: { emailId } }) => {
    await queryClient.ensureQueryData(queries.emails.detail(emailId));
  },
  pendingComponent: LoaderModal,
});
