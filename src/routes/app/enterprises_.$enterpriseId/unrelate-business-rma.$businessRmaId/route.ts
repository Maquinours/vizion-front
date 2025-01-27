import { createFileRoute, notFound, redirect } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../utils/constants/queryKeys';
import { toast } from 'react-toastify';

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/unrelate-business-rma/$businessRmaId')({
  pendingComponent: LoaderModal,
  beforeLoad: async ({ context: { queryClient } }) => {
    const user = await queryClient.ensureQueryData(queries.user.authentified());
    if (!user.userInfo.roles.includes('ROLE_MEMBRE_VIZEO')) throw notFound();
  },
  loader: async ({ context: { queryClient }, params: { businessRmaId, enterpriseId } }) => {
    const allBusiness = await queryClient.ensureQueryData(queries['all-businesses'].detail._ctx.byId(businessRmaId));
    if (allBusiness.enterpriseId === enterpriseId) {
      toast.error("Cette entreprise étant l'entreprise principale de l'affaire, vous ne pouvez pas supprimer leur lien.");
      throw redirect({ from: Route.fullPath, to: '../..', search: true, replace: true, resetScroll: false });
    }
  },
});
