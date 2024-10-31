import { createFileRoute } from '@tanstack/react-router'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/products_/$productId/manage/create-version',
)({
  pendingComponent: LoaderModal,
})
