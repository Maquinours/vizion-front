import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/scheduler-event-details/$eventId')({
  loader: ({ context: { queryClient }, params: { eventId } }) => queryClient.ensureQueryData(queries['rdv-user-infos'].list._ctx.byRdvId(eventId)),
  pendingComponent: LoaderModal,
});
