import { createFileRoute } from '@tanstack/react-router'
import LoaderModal from '../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/enterprises_/$enterpriseId/address-book/import',
)({
  pendingComponent: LoaderModal,
})
