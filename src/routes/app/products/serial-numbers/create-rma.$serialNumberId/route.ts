import { createFileRoute, redirect } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/serial-numbers/create-rma/$serialNumberId')({
  loader: async ({ context: { queryClient }, params: { serialNumberId } }) => {
    const serialNumber = await queryClient.ensureQueryData(queries['product-serial-numbers'].detail._ctx.byId(serialNumberId));
    if (!serialNumber.businessNumber || !serialNumber.businessNumber.startsWith('VZO ')) throw redirect({ from: Route.id, to: '../..', search: (old) => old });
  },
  pendingComponent: LoaderModal,
});
