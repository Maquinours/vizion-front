import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/send-email-to-contact/$contactId')({
  loader: ({ context: { queryClient }, params: { contactId } }) => queryClient.ensureQueryData(queries.profiles.detail(contactId)),
});
