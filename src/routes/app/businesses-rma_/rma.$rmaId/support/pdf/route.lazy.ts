import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewRmaViewSupportViewPdfModalView from '../../../../../../views/App/views/Rma/views/Support/views/PdfModal/PdfModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/rma/$rmaId/support/pdf',
)({
  component: AppViewRmaViewSupportViewPdfModalView,
})
