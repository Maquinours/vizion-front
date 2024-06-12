import { QueryKey } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import { productSpecificationsQueryKeys } from '../../../../../utils/constants/queryKeys/productSpecifications';
import AdvancedProductSpecificationProductResponseDto from '../../../../../utils/types/AdvancedProductSpecificationProductResponseDto';
import Page from '../../../../../utils/types/Page';

export const Route = createFileRoute('/app/products/$productId/manage/delete-specification/$specificationId')({
  loader: async ({ context: { queryClient }, params: { productId, specificationId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...productSpecificationsQueryKeys.detail._ctx.byId({ productId, specificationId }),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<AdvancedProductSpecificationProductResponseDto>>({
          queryKey: productSpecificationsQueryKeys.page.queryKey,
        })) {
          const item = value?.content.find((item) => item.id?.specificationId === specificationId);
          if (item) {
            initialDataKey = key;
            return item;
          }
        }
      },
      initialDataUpdatedAt: () => (initialDataKey ? queryClient.getQueryState(initialDataKey)?.dataUpdatedAt : undefined),
    });
  },
  pendingComponent: LoaderModal,
});
