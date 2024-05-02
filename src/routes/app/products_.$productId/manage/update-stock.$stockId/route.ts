import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/update-stock/$stockId')({
  loader: async ({ context: { queryClient }, params: { stockId, productId } }) => {
    const stock = await queryClient.ensureQueryData(queries['product-version-shelf-stocks'].detail._ctx.byId(stockId));
    if (stock.productId !== productId) throw notFound();
  },
});
