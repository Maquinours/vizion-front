import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewDashboardViewSendEmailModalViewPredefinedMessagesModalView from '../../../../../../../views/App/views/Business/views/Dashboard/views/SendEmailModal/views/PredefinedMessagesModal/PredefinedMessagesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/send-email/predefined-messages',
)({
  component:
    AppViewBusinessViewDashboardViewSendEmailModalViewPredefinedMessagesModalView,
})
