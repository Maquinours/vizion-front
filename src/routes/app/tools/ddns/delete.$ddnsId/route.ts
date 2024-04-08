import { createFileRoute } from '@tanstack/react-router';
import { ddns } from '../../../../../utils/constants/queryKeys/ddns';

export const Route = createFileRoute('/app/tools/ddns/delete/$ddnsId')({
  loader: ({ context: { queryClient }, params: { ddnsId } }) => {
    queryClient.ensureQueryData(ddns.detail(ddnsId));
  },
});
