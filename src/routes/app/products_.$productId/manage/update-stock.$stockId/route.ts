import { createFileRoute, notFound } from '@tanstack/react-router';
import { productVersionShelfStocksQueryKeys } from '../../../../../utils/constants/queryKeys/productVersionShelfStock';
import { getProductVersionShelfStockById } from '../../../../../utils/api/productVersionShelfStock';

export const Route = createFileRoute('/app/products/$productId/manage/update-stock/$stockId')({
  loader: async ({ context: { queryClient }, params: { stockId, productId } }) => {
    const stock = await queryClient.ensureQueryData({
      queryKey: productVersionShelfStocksQueryKeys.detailById(stockId),
      queryFn: () => getProductVersionShelfStockById(stockId),
    });
    if (stock.productId !== productId) throw notFound();
  },
});
