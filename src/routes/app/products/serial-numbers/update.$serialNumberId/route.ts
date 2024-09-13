import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/serial-numbers/update/$serialNumberId')({
  loader: async ({ context: { queryClient }, params: { serialNumberId } }) => {
    const serialNumber = await queryClient.fetchQuery(queries['product-serial-numbers'].detail._ctx.byId(serialNumberId));
    return { serialNumber };
  },
  pendingComponent: LoaderModal,
});
