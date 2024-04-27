import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import Page from '../../../../../utils/types/Page';
import ProductShelfResponseDto from '../../../../../utils/types/ProductShelfResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/product-shelves/delete/$productShelfId')({
  loader: async ({ context: { queryClient }, params: { productShelfId } }) => {
    let initialDataKey: QueryKey | undefined;

    await queryClient.ensureQueryData({
      ...queries['product-shelves'].detail._ctx.byId(productShelfId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<ProductShelfResponseDto>>({ queryKey: queries['product-shelves'].page.queryKey })) {
          const item = value?.content.find((item) => item.id === productShelfId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined,
    });
  },
});
