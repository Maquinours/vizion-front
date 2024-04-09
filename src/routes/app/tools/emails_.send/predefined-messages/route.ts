import { createFileRoute } from '@tanstack/react-router';
import { predefinedMessageQueryKeys } from '../../../../../utils/constants/queryKeys/predefinedMessage';
import { getAllPredefinedMessages } from '../../../../../utils/api/predefinedMessage';

export const Route = createFileRoute('/app/tools/emails/send/predefined-messages')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({
      queryKey: predefinedMessageQueryKeys.listAll(),
      queryFn: getAllPredefinedMessages,
    });
  },
});
