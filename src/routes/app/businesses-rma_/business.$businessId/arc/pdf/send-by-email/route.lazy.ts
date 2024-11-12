import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewArcViewPdfModalViewSendByEmailModalView from '../../../../../../../views/App/views/Business/views/Arc/views/PdfModal/views/SendByEmailModal/SendByEmailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/arc/pdf/send-by-email',
)({
  component: AppViewBusinessViewArcViewPdfModalViewSendByEmailModalView,
})
