import { createFileRoute } from '@tanstack/react-router';
import { departments } from '../../../../../utils/constants/queryKeys/department';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(departments.list);
  },
});
