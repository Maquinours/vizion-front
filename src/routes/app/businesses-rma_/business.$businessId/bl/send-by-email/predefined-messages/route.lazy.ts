import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewBlViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../views/App/views/Business/views/Bl/views/SendByEmailModal/PredefinedMessagesModal/PredefinedMessagesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/bl/send-by-email/predefined-messages',
)({
  component:
    AppViewBusinessViewBlViewSendByEmailModalViewPredefinedMessagesModalView,
})
