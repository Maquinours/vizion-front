import { createFileRoute } from '@tanstack/react-router';
import { mailQueryKeys } from '../../../../../utils/constants/queryKeys/mails';

export const Route = createFileRoute('/app/tools/mails/update/$mailId')({
  loader: async ({ context: { queryClient }, params: { mailId } }) => {
    return { mail: await queryClient.ensureQueryData(mailQueryKeys.detail._ctx.byId(mailId)) };
  },
});
