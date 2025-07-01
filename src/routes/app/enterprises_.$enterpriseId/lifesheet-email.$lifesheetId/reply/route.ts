import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/lifesheet-email/$lifesheetId/reply')({
  loader: async ({ context: { queryClient }, params: { lifesheetId } }) => {
    const lifesheet = await queryClient.ensureQueryData(queries.lifesheets.detail._ctx.byId(lifesheetId));

    const email = await queryClient.ensureQueryData(queries.emails.detail(lifesheet.mailId!));
    return { email };
  },
  pendingComponent: LoaderModal,
});
