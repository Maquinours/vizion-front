import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewArcViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../../views/App/views/Business/views/Arc/views/PdfModal/views/SendByEmailModal/PredefinedMessagesModal/PredefinedMessagesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/arc/pdf/send-by-email/predefined-messages',
)({
  component:
    AppViewBusinessViewArcViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView,
})
