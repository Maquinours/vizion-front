import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/emails/send/predefined-messages')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queries['predefined-message'].list);
  },
  pendingComponent: LoaderModal,
});
