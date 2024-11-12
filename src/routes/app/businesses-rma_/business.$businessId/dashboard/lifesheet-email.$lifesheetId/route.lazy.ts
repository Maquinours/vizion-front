import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewDashboardViewLifesheetEmailModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/LifesheetEmailModal/LifesheetEmailModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/lifesheet-email/$lifesheetId',
)({
  component: AppViewBusinessViewDashboardViewLifesheetEmailModalView,
})
