import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewSupportViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../../views/App/views/Rma/views/Support/views/PdfModal/views/SendByEmailModal/views/PredefinedMessagesModal/PredefinedMessagesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/support/pdf/send-by-email/predefined-messages',
)({
  component:
    AppViewRmaViewSupportViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView,
})
