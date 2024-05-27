import { createFileRoute } from '@tanstack/react-router';
import CategoryClient from '../../../../utils/enums/CategoryClient';
import { queries } from '../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/dashboard/create-personal-task')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.enterprise.list._ctx.byCategory(CategoryClient.VIZEO)._ctx.profiles._ctx.list);
  },
  pendingComponent: LoaderModal,
});
