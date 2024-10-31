import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../utils/enums/AssistanceState';

export const Route = createFileRoute('/app/businesses-rma_/rma/$rmaId/')({
  // TODO: set this code to beforeLoad instead when route context undefined error is fixed
  loader: async ({ context: { queryClient }, params: { rmaId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    switch (rma.state) {
      case AssistanceState.RECEPTION:
        throw redirect({
          from: Route.fullPath,
          to: 'reception',
          search: true,
          replace: true,
        });
      case AssistanceState.ANALYSE_REPARATION_EXPEDITION:
        throw redirect({
          from: Route.fullPath,
          to: 'delivery',
          search: true,
          replace: true,
        });
      default:
        throw redirect({
          from: Route.fullPath,
          to: 'support',
          search: true,
          replace: true,
        });
    }
  },
});
