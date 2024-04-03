import { createFileRoute } from '@tanstack/react-router';
import { ddnsQueryKeys } from '../../../../../utils/constants/queryKeys/ddns';
import { getDdnsById } from '../../../../../utils/api/ddns';

export const Route = createFileRoute('/app/tools/ddns/delete/$ddnsId')({
  loader: ({ context: { queryClient }, params: { ddnsId } }) => {
    queryClient.ensureQueryData({ queryKey: ddnsQueryKeys.detailById(ddnsId), queryFn: () => getDdnsById(ddnsId) });
  },
});
