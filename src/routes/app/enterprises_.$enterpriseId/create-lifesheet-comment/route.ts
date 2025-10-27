import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/enterprises_/$enterpriseId/create-lifesheet-comment')({
  loader: ({ context: { queryClient }, params: { enterpriseId } }) => {
    queryClient.prefetchQuery(queries.profiles.list._ctx.byEnterpriseId(enterpriseId));
  },
  pendingComponent: LoaderModal,
});
