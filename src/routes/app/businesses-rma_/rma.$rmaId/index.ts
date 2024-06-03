import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';
import AssistanceState from '../../../../utils/enums/AssistanceState';

export const Route = createFileRoute('/app/businesses-rma/rma/$rmaId/')({
  beforeLoad: async ({ context: { queryClient }, params: { rmaId } }) => {
    const rma = await queryClient.ensureQueryData(queries.rmas.detail(rmaId));
    switch (rma.state) {
      case AssistanceState.RECEPTION:
        throw redirect({ from: Route.id, to: 'reception', search: true, replace: true });
      case AssistanceState.ANALYSE_REPARATION_EXPEDITION:
        throw redirect({ from: Route.id, to: 'delivery', search: true, replace: true });
      default:
        throw redirect({ from: Route.id, to: 'support', search: true, replace: true });
    }
  },
});
