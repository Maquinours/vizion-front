import { createFileRoute } from '@tanstack/react-router';
import { queries } from '../../../../../../utils/constants/queryKeys';
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal';

export const Route = createFileRoute('/app/products/$productId/manage/add-specification/$filterId')({
  loader: ({ context: { queryClient }, params: { filterId } }) => {
    queryClient.ensureQueryData(queries['product-filter'].detail._ctx.byId(filterId));
  },
  pendingComponent: LoaderModal,
});
