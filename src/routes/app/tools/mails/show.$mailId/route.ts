import { createFileRoute } from '@tanstack/react-router';
import { mailQueryKeys } from '../../../../../utils/constants/queryKeys/mails';

export const Route = createFileRoute('/app/tools/mails/show/$mailId')({
  loader: async ({ context: { queryClient }, params: { mailId } }) => {
    await queryClient.ensureQueryData(mailQueryKeys.detail._ctx.byId(mailId));
  },
});
