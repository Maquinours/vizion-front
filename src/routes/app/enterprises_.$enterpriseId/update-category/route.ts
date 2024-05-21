import { createFileRoute, redirect } from '@tanstack/react-router';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update-category')({
  beforeLoad: async ({ context: { queryClient }, params: { enterpriseId } }) => {
    const enterprise = await queryClient.ensureQueryData(enterprises.detail(enterpriseId));
    if ([CategoryClient.VIZEO, CategoryClient.FOURNISSEUR, CategoryClient.REPRESENTANT].includes(enterprise.category)) {
      console.warn('Not allowed to access this route', Route, enterprise);
      throw redirect({ from: Route.id, to: '..', search: (old) => old });
    }
  },
  pendingComponent: LoaderModal,
});
