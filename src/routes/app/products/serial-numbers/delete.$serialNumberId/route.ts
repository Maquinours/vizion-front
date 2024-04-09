import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/serial-numbers/delete/$serialNumberId')({
  loader: async ({ context: { queryClient }, params: { serialNumberId } }) => {
    const serialNumber = await queryClient.ensureQueryData(queries['product-serial-numbers'].detail._ctx.byId(serialNumberId));
    if (serialNumber.businessId || serialNumber.businessNumber) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
});
