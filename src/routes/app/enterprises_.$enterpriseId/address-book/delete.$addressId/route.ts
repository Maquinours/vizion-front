import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import Page from '../../../../../utils/types/Page';
import AddressResponseDto from '../../../../../utils/types/AddressResponseDto';
import { QueryKey } from '@tanstack/react-query';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/address-book/delete/$addressId')({
  loader: async ({ context: { queryClient }, params: { addressId } }) => {
    let initialDataKey: QueryKey | undefined = undefined;
    await queryClient.ensureQueryData({
      ...queries.address.detail._ctx.byId(addressId),
      initialData: () => {
        for (const [key, value] of queryClient.getQueriesData<Page<AddressResponseDto>>({ queryKey: queries.address.page.queryKey })) {
          const item = value?.content.find((item) => item.id === addressId);
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
