import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/businesses-rma/search-by-products')({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.prefetchQuery(queries.product.list);
  },
  pendingComponent: LoaderModal,
});
