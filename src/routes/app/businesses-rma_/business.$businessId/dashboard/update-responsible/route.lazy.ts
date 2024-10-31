import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewBusinessViewDashboardViewUpdateResponsibleModalView from '../../../../../../views/App/views/Business/views/Dashboard/views/UpdateResponsibleModal/UpdateResponsibleModal'

export const Route = createLazyFileRoute(
  '/app/businesses-rma_/business/$businessId/dashboard/update-responsible',
)({
  component: AppViewBusinessViewDashboardViewUpdateResponsibleModalView,
})
