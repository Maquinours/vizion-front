import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import { QueryKey } from '@tanstack/react-query';
import Page from '../../../../../utils/types/Page';
import ProductVersionShelfStockResponseDto from '../../../../../utils/types/ProductVersionShelfStockResponseDto';

export const Route = createFileRoute('/app/products/$productId/manage/delete-stock/$stockId')({
  loader: async ({ context: { queryClient }, params: { stockId, productId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    const stock = await queryClient.ensureQueryData({
      ...queries['product-version-shelf-stocks'].detail._ctx.byId(stockId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<ProductVersionShelfStockResponseDto>>({
          queryKey: queries['product-version-shelf-stocks'].page.queryKey,
        })) {
          const item = value?.content.find((item) => item.id === stockId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
    if (stock.productId !== productId) throw notFound();
  },
  pendingComponent: LoaderModal,
});
