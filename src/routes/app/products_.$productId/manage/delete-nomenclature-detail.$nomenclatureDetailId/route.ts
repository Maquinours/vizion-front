import { createFileRoute, notFound } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products_/$productId/manage/delete-nomenclature-detail/$nomenclatureDetailId')({
  loader: async ({ context: { queryClient }, params: { productId, nomenclatureDetailId } }) => {
    const nomenclatureDetail = (await queryClient.ensureQueryData(queries.product.detail(productId))).productBOMDetails?.find(
      (bom) => bom.id === nomenclatureDetailId,
    );
    if (!nomenclatureDetail) throw notFound();
  },
  pendingComponent: LoaderModal,
});
