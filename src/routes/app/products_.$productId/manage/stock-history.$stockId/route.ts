import { createFileRoute, notFound } from '@tanstack/react-router';
import { z } from 'zod';
import { getProductVersionShelfStockEntriesPageByProductShelfStock } from '../../../../../utils/api/productVersionShelfStockEntry';
import { queries } from '../../../../../utils/constants/queryKeys';
import { productVersionShelfStockEntryQueryKeys } from '../../../../../utils/constants/queryKeys/productVersionShelfStockEntry';

const searchSchema = z.object({
  stockHistoryPage: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/products/$productId/manage/stock-history/$stockId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { stockHistoryPage } }) => ({ page: stockHistoryPage, size: 5 }),
  loader: async ({ context: { queryClient }, params: { stockId, productId }, deps: { page, size } }) => {
    queryClient.ensureQueryData({
      queryKey: productVersionShelfStockEntryQueryKeys.pageByVersionShelfStockId(stockId, page, size),
      queryFn: () => getProductVersionShelfStockEntriesPageByProductShelfStock(stockId, page, size),
    });

    const stock = await queryClient.ensureQueryData(queries.product.versionShelfStocks._ctx.detail(stockId));
    if (stock.productId !== productId) throw notFound();
  },
});
