import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/tools/menu/create-enterprise')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.departments.list);
  },
  pendingComponent: LoaderModal,
});
