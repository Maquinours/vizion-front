import { createFileRoute } from '@tanstack/react-router';
import { productShelfQueryKeys } from '../../../../../utils/constants/queryKeys/productShelf';
import { getAllProductShelves } from '../../../../../utils/api/productShelf';
import { productVersionQueryKeys } from '../../../../../utils/constants/queryKeys/productVersion';
import { getProductVersions } from '../../../../../utils/api/productVersion';

export const Route = createFileRoute('/app/products/serial-numbers/create')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({
      queryKey: productVersionQueryKeys.listAll(),
      queryFn: getProductVersions,
    });
    queryClient.ensureQueryData({
      queryKey: productShelfQueryKeys.listAll(),
      queryFn: getAllProductShelves,
    });
  },
});
