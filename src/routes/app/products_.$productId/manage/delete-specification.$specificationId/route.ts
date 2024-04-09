import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/delete-specification/$specificationId')({
  loader: ({ context: { queryClient }, params: { productId, specificationId } }) => {
    queryClient.ensureQueryData(queries.product.detail._ctx.byId(productId)._ctx.specifications._ctx.detail._ctx.byId(specificationId));
  },
});
