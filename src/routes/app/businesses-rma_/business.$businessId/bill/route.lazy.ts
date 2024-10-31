import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewBillView from '../../../../../views/App/views/Business/views/Bill/Bill'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/bill',
)({
  component: AppViewBusinessViewBillView,
})
