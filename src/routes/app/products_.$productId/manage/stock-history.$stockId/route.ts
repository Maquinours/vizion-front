import { createFileRoute, notFound } from '@tanstack/react-router';
import { z } from 'zod';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

const searchSchema = z.object({
  stockHistoryPage: z.number().min(0).catch(0),
});

export const Route = createFileRoute('/app/products/$productId/manage/stock-history/$stockId')({
  validateSearch: searchSchema,
  loaderDeps: ({ search: { stockHistoryPage } }) => ({ page: stockHistoryPage, size: 5 }),
  loader: async ({ context: { queryClient }, params: { stockId, productId }, deps: { page, size } }) => {
    queryClient.ensureQueryData(queries['product-version-shelf-stock-entries'].page._ctx.byProductShelfStockId(stockId, { page, size }));

    const stock = await queryClient.ensureQueryData(queries['product-version-shelf-stocks'].detail._ctx.byId(stockId));
    if (stock.productId !== productId) throw notFound();
  },
  pendingComponent: LoaderModal,
});
