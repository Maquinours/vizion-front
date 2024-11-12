import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/products_/$productId/manage/create-stock',
)({
  loader: ({ context: { queryClient }, params: { productId } }) => {
    queryClient.prefetchQuery(
      queries['product-versions'].list._ctx.byProductId(productId),
    )
    queryClient.prefetchQuery(queries['product-shelves'].list)
  },
  pendingComponent: LoaderModal,
})
