import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewArcView from '../../../../../views/App/views/Business/views/Arc/Arc'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/arc',
)({
  component: AppViewBusinessViewArcView,
})
