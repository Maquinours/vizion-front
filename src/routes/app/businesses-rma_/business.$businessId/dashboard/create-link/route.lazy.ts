import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewDashboardViewCreateLinkModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/CreateLinkModal/CreateLinkModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/create-link',
)({
  component: AppViewBusinessViewDashboardViewCreateLinkModalView,
})
