import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/tools/credit/details')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.enterprise.list);
  },
});
