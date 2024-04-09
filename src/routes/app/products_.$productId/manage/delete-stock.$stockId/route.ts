import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/delete-stock/$stockId')({
  loader: async ({ context: { queryClient }, params: { stockId, productId } }) => {
    const stock = await queryClient.ensureQueryData(queries.product.versionShelfStocks._ctx.detail(stockId));
    if (stock.productId !== productId) throw notFound();
  },
});
