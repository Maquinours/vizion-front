import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../utils/constants/queryKeys';
import CategoryClient from '../../../../../utils/enums/CategoryClient';

export const Route = createFileRoute('/app/tools/menu/create-enterprise')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.departments.list);
    queryClient.prefetchQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.REPRESENTANT));
  },
  pendingComponent: LoaderModal,
});
