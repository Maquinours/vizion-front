import { createFileRoute } from '@tanstack/react-router';
import { rdvUserInfosQueryKeys } from '../../../../utils/constants/queryKeys/rdvUserInfo';
import { getRdvUserInfosByRdvId } from '../../../../utils/api/rdvUserInfo';

export const Route = createFileRoute('/app/dashboard/scheduler-event-details/$eventId')({
  loader: ({ context: { queryClient }, params: { eventId } }) =>
    queryClient.ensureQueryData({ queryKey: rdvUserInfosQueryKeys.listByRdvId(eventId), queryFn: () => getRdvUserInfosByRdvId(eventId) }),
});
