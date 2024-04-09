import { createFileRoute } from '@tanstack/react-router';
import { getProductVersions } from '../../../../../utils/api/productVersion';
import { queries } from '../../../../../utils/constants/queryKeys';
import { productVersionQueryKeys } from '../../../../../utils/constants/queryKeys/productVersion';

export const Route = createFileRoute('/app/products/serial-numbers/create')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData({
      queryKey: productVersionQueryKeys.listAll(),
      queryFn: getProductVersions,
    });
    queryClient.ensureQueryData(queries['product-shelves'].list);
  },
});
