import { createFileRoute } from '@tanstack/react-router';
import { enterprises } from '../../../../../utils/constants/queryKeys/enterprise';
import CategoryClient from '../../../../../utils/enums/CategoryClient';

export const Route = createFileRoute('/app/enterprises/$enterpriseId/update-representative')({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(enterprises.list._ctx.byCategory(CategoryClient.REPRESENTANT));
  },
});
