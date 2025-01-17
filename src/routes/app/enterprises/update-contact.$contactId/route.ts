import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/update-contact/$contactId')({
  loader: ({ context: { queryClient }, params: { contactId } }) => {
    queryClient.ensureQueryData(queries.profiles.detail._ctx.byId(contactId));
  },
  pendingComponent: LoaderModal,
});
