import { createFileRoute } from '@tanstack/react-router';
import { productQueryKeys } from '../../../../../utils/constants/queryKeys/product';
import { getProductById } from '../../../../../utils/api/product';

export const Route = createFileRoute('/app/products/$productId/manage/remove-associated-product/$associatedProductId')({
  loader: ({ context: { queryClient }, params: { associatedProductId } }) => {
    queryClient.ensureQueryData({
      queryKey: productQueryKeys.detailById(associatedProductId),
      queryFn: () => getProductById(associatedProductId),
    });
  },
});
