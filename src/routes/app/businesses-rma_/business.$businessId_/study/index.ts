import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/business/$businessId/study/')({
  loader: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (user.profile.expert) throw redirect({ from: Route.id, to: 'expert', replace: true });
    else throw redirect({ from: Route.id, to: 'automatic', replace: true });
  },
});
