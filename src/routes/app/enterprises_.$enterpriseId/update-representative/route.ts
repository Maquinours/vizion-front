import { createFileRoute } from '@tanstack/react-router';
import { enterprises } from '../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update-representative')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));
  },
  pendingComponent: LoaderModal,
});
