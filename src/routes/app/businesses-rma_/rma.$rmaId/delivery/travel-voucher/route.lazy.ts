import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewDeliveryViewTravelVoucherModalView from '../../../../../../views/App/views/Rma/views/Delivery/views/TravelVoucherModal/TravelVoucherModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/delivery/travel-voucher',
)({
  component: AppViewRmaViewDeliveryViewTravelVoucherModalView,
})
