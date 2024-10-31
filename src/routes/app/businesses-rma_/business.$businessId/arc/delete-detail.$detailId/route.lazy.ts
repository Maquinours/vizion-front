import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewArcViewDeleteDetailModalView from '../../../../../../views/App/views/Business/views/Arc/views/DeleteDetailModal/DeleteDetailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/arc/delete-detail/$detailId',
)({
  component: AppViewBusinessViewArcViewDeleteDetailModalView,
})
