import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma_/business/$businessId/dashboard/lifesheet-email/$lifesheetId/resend')({
  loader: async ({ context: { queryClient }, params: { lifesheetId } }) => {
    const lifesheet = await queryClient.ensureQueryData(queries.lifesheets.detail._ctx.byId(lifesheetId));

    const email = await queryClient.ensureQueryData(queries.emails.detail(lifesheet.mailId!));
    return { email };
  },
  pendingComponent: LoaderModal,
});
