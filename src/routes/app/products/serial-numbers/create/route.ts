import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/serial-numbers/create')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queries['product-versions'].list._ctx.all);
    queryClient.ensureQueryData(queries['product-shelves'].list);
  },
});
