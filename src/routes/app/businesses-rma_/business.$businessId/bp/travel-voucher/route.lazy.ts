import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewBpViewTravelVoucherModalView from '../../../../../../views/App/views/Business/views/Bp/views/TravelVoucherModal/TravelVoucherModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/bp/travel-voucher',
)({
  component: AppViewBusinessViewBpViewTravelVoucherModalView,
})
