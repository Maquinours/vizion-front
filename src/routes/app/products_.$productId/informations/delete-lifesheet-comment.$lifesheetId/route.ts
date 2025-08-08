import { createFileRoute, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products_/$productId/informations/delete-lifesheet-comment/$lifesheetId')({
  loader: async ({ context: { queryClient }, params: { lifesheetId } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_DIRECTION_VIZEO'))
      throw redirect({ from: Route.fullPath, to: '../..', search: true, replace: true, resetScroll: false });
    const lifesheet = await queryClient.ensureQueryData(queries.lifesheets.detail._ctx.byId(lifesheetId));
    if (!lifesheet) throw redirect({ from: Route.fullPath, to: '../..', search: true, replace: true, resetScroll: false });

    return { lifesheet };
  },
  pendingComponent: LoaderModal,
});
