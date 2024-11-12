import { createFileRoute } from '@tanstack/react-router'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId/bp/travel-voucher',
)({
  pendingComponent: LoaderModal,
})
