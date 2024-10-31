import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewUpdateAccountabilityModalView from '../../../../views/App/views/Enterprise/views/UpdateAccountabilityModal/UpdateAccountability'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/update-accountability',
)({
  component: AppViewEnterpriseViewUpdateAccountabilityModalView,
})
