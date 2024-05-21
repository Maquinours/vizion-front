import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/$productId/manage/delete-stock/$stockId')({
  loader: async ({ context: { queryClient }, params: { stockId, productId } }) => {
    const stock = await queryClient.ensureQueryData(queries['product-version-shelf-stocks'].detail._ctx.byId(stockId));
    if (stock.productId !== productId) throw notFound();
  },
  pendingComponent: LoaderModal,
});
