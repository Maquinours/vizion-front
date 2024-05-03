import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/tools/menu/create-product')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.enterprise.list._ctx.providers);
  },
});
