import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries.departments.list);
  },
});
