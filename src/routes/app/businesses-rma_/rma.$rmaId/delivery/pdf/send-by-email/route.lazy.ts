import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewDeliveryViewPdfModalViewSendByEmailModalView from '../../../../../../../views/App/views/Rma/views/Delivery/views/PdfModal/views/SendByEmailModal/SendByEmailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/delivery/pdf/send-by-email',
)({
  component: AppViewRmaViewDeliveryViewPdfModalViewSendByEmailModalView,
})
