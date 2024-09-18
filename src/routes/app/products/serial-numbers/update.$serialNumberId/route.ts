import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import Page from '../../../../../utils/types/Page';
import ProductSerialNumberResponseDto from '../../../../../utils/types/ProductSerialNumberResponseDto';
import { QueryKey } from '@tanstack/react-query';

export const Route = createFileRoute('/app/products/serial-numbers/update/$serialNumberId')({
  loader: async ({ context: { queryClient }, params: { serialNumberId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;

    await queryClient.ensureQueryData({
      ...queries['product-serial-numbers'].detail._ctx.byId(serialNumberId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<ProductSerialNumberResponseDto>>({
          queryKey: queries['product-serial-numbers'].page._def,
        })) {
          const item = value?.content.find((item) => item.id === serialNumberId);
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
