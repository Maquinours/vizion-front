import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/enterprises/create-contact-business/$contactId')({
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    await queryClient.ensureQueryData(queries.profiles.detail(contactId));
  },
});
