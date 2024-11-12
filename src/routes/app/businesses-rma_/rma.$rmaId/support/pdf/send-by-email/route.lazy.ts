import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewSupportViewPdfModalViewSendByEmailModalView from '../../../../../../../views/App/views/Rma/views/Support/views/PdfModal/views/SendByEmailModal/SendByEmailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/support/pdf/send-by-email',
)({
  component: AppViewRmaViewSupportViewPdfModalViewSendByEmailModalView,
})
