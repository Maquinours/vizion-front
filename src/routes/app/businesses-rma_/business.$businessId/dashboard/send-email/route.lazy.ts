import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewDashboardViewSendEmailModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/SendEmailModal/SendEmailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/send-email',
)({
  component: AppViewBusinessViewDashboardViewSendEmailModalView,
})
