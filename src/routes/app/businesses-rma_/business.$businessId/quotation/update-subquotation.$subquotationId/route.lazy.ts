import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewQuotationViewUpdateSubquotationModalView from '../../../../../../views/App/views/Business/views/Quotation/views/UpdateSubquotationModal/UpdateSubquotationModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/quotation/update-subquotation/$subquotationId',
)({
  component: AppViewBusinessViewQuotationViewUpdateSubquotationModalView,
})
