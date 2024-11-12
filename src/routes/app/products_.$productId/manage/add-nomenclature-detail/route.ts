import { createFileRoute } from '@tanstack/react-router'
import { queries } from '../../../../../utils/constants/queryKeys'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/products_/$productId/manage/add-nomenclature-detail',
)({
  loader: async ({ context: { queryClient } }) => {
    await queryClient.ensureQueryData(queries.product.list)
  },
  pendingComponent: LoaderModal,
})
