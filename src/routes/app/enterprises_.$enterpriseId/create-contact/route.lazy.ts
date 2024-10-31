import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewCreateContactModalView from '../../../../views/App/views/Enterprise/views/CreateContactModal/CreateContactModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/create-contact',
)({
  component: AppViewEnterpriseViewCreateContactModalView,
})
