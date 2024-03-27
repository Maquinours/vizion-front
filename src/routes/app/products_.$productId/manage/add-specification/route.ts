import { createFileRoute } from '@tanstack/react-router';
import { productFilterQueryKeys } from '../../../../../utils/constants/queryKeys/productFilter';
import { getAllProductFilters } from '../../../../../utils/api/productFilter';

export const Route = createFileRoute('/app/products/$productId/manage/add-specification')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({
      queryKey: productFilterQueryKeys.listAll(),
      queryFn: getAllProductFilters,
    });
  },
});
