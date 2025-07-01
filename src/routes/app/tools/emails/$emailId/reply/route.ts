import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/tools/emails/$emailId/reply')({
  loader: async ({ context: { queryClient }, params: { emailId } }) => {
    const email = await queryClient.ensureQueryData(queries.emails.detail(emailId));
    return { email };
  },
  pendingComponent: LoaderModal,
});
