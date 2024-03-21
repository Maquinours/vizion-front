import { createFileRoute } from '@tanstack/react-router';
import { addressQueryKeys } from '../../../../../../utils/constants/queryKeys/address';
import { getAddressById } from '../../../../../../utils/api/address';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/address-book/update/$addressId')({
  loader: ({ context: { queryClient }, params: { addressId } }) =>
    queryClient.ensureQueryData({
      queryKey: addressQueryKeys.detailById(addressId),
      queryFn: () => getAddressById(addressId),
    }),
});
