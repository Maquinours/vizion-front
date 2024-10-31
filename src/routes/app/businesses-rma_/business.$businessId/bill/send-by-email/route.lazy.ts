import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewBillViewSendByEmailModalView from '../../../../../../views/App/views/Business/views/Bill/views/SendByEmailModal/SendByEmailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/bill/send-by-email',
)({
  component: AppViewBusinessViewBillViewSendByEmailModalView,
})
