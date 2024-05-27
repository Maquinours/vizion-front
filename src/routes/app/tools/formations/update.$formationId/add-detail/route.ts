import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../../utils/enums/CategoryClient';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/formations/update/$formationId/add-detail')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.profiles.list._ctx.byCategory(CategoryClient.VIZEO));
  },
  pendingComponent: LoaderModal,
});
