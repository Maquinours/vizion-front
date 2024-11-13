import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products_/$productId/manage/add-associated-product')({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.prefetchQuery(queries.product.list._ctx.byNotAssociatedProductId(productId));
  },
  pendingComponent: LoaderModal,
});
