import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import Page from '../../../../../utils/types/Page';
import AdvancedProductSpecificationResponseDto from '../../../../../utils/types/AdvancedProductSpecificationResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/tools/product-filters/update/$productFilterId')({
  loader: async ({ context: { queryClient }, params: { productFilterId } }) => {
    let initialDataKey: QueryKey | undefined;
    await queryClient.ensureQueryData({
      ...queries['product-filter'].detail._ctx.byId(productFilterId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<AdvancedProductSpecificationResponseDto>>({
          queryKey: queries['product-filter'].page.queryKey,
        })) {
          const item = value?.content.find((item) => item.id === productFilterId);
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
