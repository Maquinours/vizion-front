import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewDashboardViewCreateLifesheetModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/CreateLifesheetModal/CreateLifesheetModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/create-lifesheet',
)({
  component: AppViewBusinessViewDashboardViewCreateLifesheetModalView,
})
