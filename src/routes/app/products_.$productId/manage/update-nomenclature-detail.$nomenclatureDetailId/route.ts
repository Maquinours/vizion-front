import { createFileRoute } from '@tanstack/react-router';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';
import { queries } from '../../../../../utils/constants/queryKeys';
import { notFound } from '@tanstack/react-router';

export const Route = createFileRoute('/app/products_/$productId/manage/update-nomenclature-detail/$nomenclatureDetailId')({
  loader: async ({ context: { queryClient }, params: { productId, nomenclatureDetailId } }) => {
    const nomenclatureDetail = (await queryClient.ensureQueryData(queries.product.detail(productId))).productBOMDetails?.find(
      (bom) => bom.id === nomenclatureDetailId,
    );
    if (!nomenclatureDetail) throw notFound();
  },
  pendingComponent: LoaderModal,
});
