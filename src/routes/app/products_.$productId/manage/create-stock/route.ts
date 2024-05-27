import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/$productId/manage/create-stock')({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.prefetchQuery(queries.product.detail(productId)._ctx.versions._ctx.list);
    queryClient.prefetchQuery(queries['product-shelves'].list);
  },
  pendingComponent: LoaderModal,
});
