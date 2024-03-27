import { createFileRoute } from '@tanstack/react-router';
import { productFilterQueryKeys } from '../../../../../../utils/constants/queryKeys/productFilter';
import { getProductFilterById } from '../../../../../../utils/api/productFilter';

export const Route = createFileRoute('/app/products/$productId/manage/add-specification/$filterId')({
  loader: ({ context: { queryClient }, params: { filterId } }) => {
    queryClient.ensureQueryData({ queryKey: productFilterQueryKeys.detailById(filterId), queryFn: () => getProductFilterById(filterId) });
  },
});
