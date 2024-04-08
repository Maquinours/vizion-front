import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/tools/emails/send/predefined-messages')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queries['predefined-message'].list);
  },
});
