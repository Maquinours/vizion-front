import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewQuotationViewCreateAssociatedDetailModalView from '../../../../../../views/App/views/Business/views/Quotation/views/CreateAssociatedDetailModal/CreateAssociatedDetailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/quotation/create-associated-detail/$detailId',
)({
  component: AppViewBusinessViewQuotationViewCreateAssociatedDetailModalView,
})
