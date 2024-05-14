import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/address-book/delete/$addressId')({
  loader: async ({ context: { queryClient }, params: { addressId } }) => {
    await queryClient.ensureQueryData(queries.address.detail._ctx.byId(addressId));
  },
});
