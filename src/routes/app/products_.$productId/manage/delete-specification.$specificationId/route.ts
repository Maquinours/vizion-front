import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import Page from '../../../../../utils/types/Page';
import AdvancedProductSpecificationProductResponseDto from '../../../../../utils/types/AdvancedProductSpecificationProductResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/products/$productId/manage/delete-specification/$specificationId')({
  loader: async ({ context: { queryClient }, params: { productId, specificationId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...queries.product.detail(productId)._ctx.specifications._ctx.detail(specificationId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<AdvancedProductSpecificationProductResponseDto>>({
          queryKey: queries.product.detail(productId)._ctx.specifications._ctx.page._def,
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
