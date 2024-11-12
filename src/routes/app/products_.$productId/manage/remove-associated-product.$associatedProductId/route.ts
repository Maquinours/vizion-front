import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/products_/$productId/manage/remove-associated-product/$associatedProductId',
)({
  loader: ({ context: { queryClient }, params: { associatedProductId } }) => {
    queryClient.ensureQueryData(queries.product.detail(associatedProductId))
  },
  pendingComponent: LoaderModal,
})
