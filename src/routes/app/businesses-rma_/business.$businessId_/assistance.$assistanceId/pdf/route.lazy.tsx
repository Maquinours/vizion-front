import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewAssistanceViewPdfModalView from '../../../../../../views/App/views/Assistance/views/PdfModal/PdfModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId_/assistance/$assistanceId/pdf',
)({
  component: AppViewAssistanceViewPdfModalView,
})
