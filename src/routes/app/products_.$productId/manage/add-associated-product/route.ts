import { createFileRoute } from '@tanstack/react-router';
import { productQueryKeys } from '../../../../../utils/constants/queryKeys/product';
import { getNotAssociatedProducts } from '../../../../../utils/api/product';

export const Route = createFileRoute('/app/products/$productId/manage/add-associated-product')({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData({ queryKey: productQueryKeys.listNotAssociatedProducts(productId), queryFn: () => getNotAssociatedProducts(productId) });
  },
});
