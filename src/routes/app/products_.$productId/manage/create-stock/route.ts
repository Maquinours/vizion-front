import { createFileRoute } from '@tanstack/react-router';
import { productVersionQueryKeys } from '../../../../../utils/constants/queryKeys/productVersion';
import { getProductVersionsByProductId } from '../../../../../utils/api/productVersion';
import { productShelfQueryKeys } from '../../../../../utils/constants/queryKeys/productShelf';
import { getAllProductShelves } from '../../../../../utils/api/productShelf';

export const Route = createFileRoute('/app/products/$productId/manage/create-stock')({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.ensureQueryData({
      queryKey: productVersionQueryKeys.listByProductId(productId),
      queryFn: () => getProductVersionsByProductId(productId),
    });
    queryClient.ensureQueryData({
      queryKey: productShelfQueryKeys.listAll(),
      queryFn: getAllProductShelves,
    });
  },
});
