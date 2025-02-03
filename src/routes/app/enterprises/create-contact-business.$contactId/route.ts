import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/create-contact-business/$contactId')({
  loader: async ({ context: { queryClient }, params: { contactId } }) => {
    await queryClient.ensureQueryData(queries.profiles.detail._ctx.byId(contactId));
  },
  pendingComponent: LoaderModal,
});
