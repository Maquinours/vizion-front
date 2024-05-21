import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/$productId/manage/update-specification/$specificationId')({
  loader: ({ context: { queryClient }, params: { productId, specificationId } }) => {
    queryClient.ensureQueryData(queries.product.detail(productId)._ctx.specifications._ctx.detail(specificationId));
  },
  pendingComponent: LoaderModal,
});
