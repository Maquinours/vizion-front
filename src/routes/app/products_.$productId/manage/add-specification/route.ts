import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/add-specification')({
  loader: ({ context: { queryClient } }) => {
    queryClient.ensureQueryData(queries['product-filter'].list);
  },
});
