import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewBillViewCreditsModalView from '../../../../../../views/App/views/Business/views/Bill/views/CreditsModal/CreditsModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/bill/credits',
)({
  component: AppViewBusinessViewBillViewCreditsModalView,
})
