import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import Page from '../../../../../utils/types/Page';
import ProductVersionShelfStockResponseDto from '../../../../../utils/types/ProductVersionShelfStockResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/product-inventory/update/$stockId')({
  loader: async ({ context: { queryClient }, params: { stockId } }) => {
    let initialDataKey: QueryKey | undefined;
    await queryClient.ensureQueryData({
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
  },
});
