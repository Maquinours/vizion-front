import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/serial-numbers/create')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queries.product.versions._ctx.list);
    queryClient.ensureQueryData(queries['product-shelves'].list);
  },
});
