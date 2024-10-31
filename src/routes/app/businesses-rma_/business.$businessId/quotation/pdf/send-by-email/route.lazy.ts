import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewQuotationViewPdfModalViewSendByEmailModalView from '../../../../../../../views/App/views/Business/views/Quotation/views/PdfModal/views/SendByEmailModal/SendByEmailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/quotation/pdf/send-by-email',
)({
  component: AppViewBusinessViewQuotationViewPdfModalViewSendByEmailModalView,
})
