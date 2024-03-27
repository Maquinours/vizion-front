import { createFileRoute } from '@tanstack/react-router';
import { productSpecificationQueryKeys } from '../../../../../utils/constants/queryKeys/productSpecification';
import { getProductSpecificationById } from '../../../../../utils/api/productSpecification';

export const Route = createFileRoute('/app/products/$productId/manage/update-specification/$specificationId')({
  loader: ({ context: { queryClient }, params: { productId, specificationId } }) => {
    queryClient.ensureQueryData({
      queryKey: productSpecificationQueryKeys.detailById(productId, specificationId),
      queryFn: () => getProductSpecificationById(productId, specificationId),
    });
  },
});
