import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';

export const Route = createFileRoute('/app/products/$productId/manage/delete-version/$versionId')({
  loader: async ({ context: { queryClient }, params: { productId, versionId } }) => {
    const version = await queryClient.ensureQueryData(queries['product-versions'].detail._ctx.byId(versionId));
    if (!version.product || version.product.id !== productId) throw notFound();
  },
});
