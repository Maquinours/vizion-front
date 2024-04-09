import { createFileRoute } from '@tanstack/react-router';
import { getProductVersionsByProductId } from '../../../../../utils/api/productVersion';
import { queries } from '../../../../../utils/constants/queryKeys';
import { productVersionQueryKeys } from '../../../../../utils/constants/queryKeys/productVersion';

export const Route = createFileRoute('/app/products/$productId/manage/create-stock')({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData({
      queryKey: productVersionQueryKeys.listByProductId(productId),
      queryFn: () => getProductVersionsByProductId(productId),
    });
    queryClient.prefetchQuery(queries['product-shelves'].list);
  },
});
