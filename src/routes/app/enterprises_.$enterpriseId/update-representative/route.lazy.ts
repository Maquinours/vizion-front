import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewUpdateRepresentativeModalView from '../../../../views/App/views/Enterprise/views/UpdateRepresentativeModal/UpdateRepresentativeModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/update-representative',
)({
  component: AppViewEnterpriseViewUpdateRepresentativeModalView,
})
