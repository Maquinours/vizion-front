import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/remove-associated-product/$associatedProductId')({
  loader: ({ context: { queryClient }, params: { associatedProductId } }) => {
    queryClient.ensureQueryData(queries.product.detail._ctx.byId(associatedProductId));
  },
});
