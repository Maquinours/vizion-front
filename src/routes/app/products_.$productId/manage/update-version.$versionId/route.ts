import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/update-version/$versionId')({
  loader: async ({ context: { queryClient }, params: { productId, versionId } }) => {
    const version = await queryClient.ensureQueryData(queries.product.versions._ctx.detail(versionId));
    if (!version.product || version.product.id !== productId) throw notFound();
  },
});
