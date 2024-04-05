import { createFileRoute } from '@tanstack/react-router';
import { addresses } from '../../../../../../utils/constants/queryKeys/address';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/address-book/update/$addressId')({
  loader: async ({ context: { queryClient }, params: { addressId } }) => {
    await queryClient.ensureQueryData(addresses.detail({ id: addressId }));
  },
});
