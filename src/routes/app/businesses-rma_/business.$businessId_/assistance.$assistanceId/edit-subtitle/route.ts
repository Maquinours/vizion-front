import { createFileRoute } from '@tanstack/react-router'
import LoaderModal from '../../../../../../components/LoaderModal/LoaderModal'

export const Route = createFileRoute(
  '/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/edit-subtitle',
)({
  pendingComponent: LoaderModal,
})
