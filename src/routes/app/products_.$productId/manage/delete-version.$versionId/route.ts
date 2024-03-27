import { createFileRoute, notFound } from '@tanstack/react-router';
import { getProductVersionById } from '../../../../../utils/api/productVersion';
import { productVersionQueryKeys } from '../../../../../utils/constants/queryKeys/productVersion';

export const Route = createFileRoute('/app/products/$productId/manage/delete-version/$versionId')({
  loader: async ({ context: { queryClient }, params: { productId, versionId } }) => {
    const version = await queryClient.ensureQueryData({
      queryKey: productVersionQueryKeys.detailById(versionId),
      queryFn: () => getProductVersionById(versionId),
    });
    if (!version.product || version.product.id !== productId) throw notFound();
  },
});
