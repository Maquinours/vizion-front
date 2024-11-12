import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewArcViewUpdateDetailModalView from '../../../../../../views/App/views/Business/views/Arc/views/UpdateDetailModal/UpdateDetailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/arc/update-detail/$detailId',
)({
  component: AppViewBusinessViewArcViewUpdateDetailModalView,
})
