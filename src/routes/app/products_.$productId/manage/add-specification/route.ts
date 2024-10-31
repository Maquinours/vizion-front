import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/products_/$productId/manage/add-specification',
)({
  loader: ({ context: { queryClient } }) => {
    queryClient.prefetchQuery(queries['product-filter'].list)
  },
  pendingComponent: LoaderModal,
})
