import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewQuotationViewDeleteSubquotationModalView from '../../../../../../views/App/views/Business/views/Quotation/views/DeleteSubquotationModal/DeleteSubquotationModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/quotation/delete-subquotation/$subquotationId',
)({
  component: AppViewBusinessViewQuotationViewDeleteSubquotationModalView,
})
