import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/serial-numbers/create')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries['product-versions'].list._ctx.all);
    queryClient.prefetchQuery(queries['product-shelves'].list);
  },
  pendingComponent: LoaderModal,
});
