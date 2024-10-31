import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../../utils/enums/AssistanceState';

export const Route = createFileRoute('/app/businesses-rma_/rma/$rmaId/reception')({
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    if (![AssistanceState.RECEPTION, AssistanceState.ANALYSE_REPARATION_EXPEDITION, AssistanceState.ARCHIVE].includes(rma.state))
      throw redirect({
        from: Route.fullPath,
        to: '/app/businesses-rma/rma/$rmaId',
        search: true,
        replace: true,
      });
  },
});
