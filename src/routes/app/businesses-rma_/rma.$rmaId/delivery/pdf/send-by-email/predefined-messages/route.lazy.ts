import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewDeliveryViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../../views/App/views/Rma/views/Delivery/views/PdfModal/views/SendByEmailModal/views/PredefinedMessagesModal/PredefinedMessagesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/delivery/pdf/send-by-email/predefined-messages',
)({
  component:
    AppViewRmaViewDeliveryViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView,
})
