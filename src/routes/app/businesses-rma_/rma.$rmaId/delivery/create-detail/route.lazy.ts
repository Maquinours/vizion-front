import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewDeliveryViewCreateDetailModal from '../../../../../../views/App/views/Rma/views/Delivery/views/CreateDetailModal/CreateDetailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/delivery/create-detail',
)({
  component: AppViewRmaViewDeliveryViewCreateDetailModal,
})
