import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewQuotationViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView from '../../../../../../../../views/App/views/Business/views/Quotation/views/PdfModal/views/SendByEmailModal/views/PredefinedMessagesModal/PredefinedMessagesModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/quotation/pdf/send-by-email/predefined-messages',
)({
  component:
    AppViewBusinessViewQuotationViewPdfModalViewSendByEmailModalViewPredefinedMessagesModalView,
})
