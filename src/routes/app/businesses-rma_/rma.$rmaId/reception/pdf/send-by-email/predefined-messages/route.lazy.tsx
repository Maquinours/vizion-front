import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewReceptionViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../../views/App/views/Rma/views/Reception/views/PdfModal/views/SendByEmailModal/views/PredefinedMessagesModal/PredefinedMessagesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/reception/pdf/send-by-email/predefined-messages',
)({
  component:
    AppViewRmaViewReceptionViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView,
})
