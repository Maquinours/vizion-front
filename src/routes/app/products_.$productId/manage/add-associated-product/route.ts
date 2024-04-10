import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/add-associated-product')({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.prefetchQuery(queries.product.list._ctx.byNotAssociatedProductId(productId));
  },
});
