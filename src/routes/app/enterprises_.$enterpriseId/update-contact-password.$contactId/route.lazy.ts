import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewUpdateContactPasswordView from '../../../../views/App/views/Enterprise/views/UpdateContactPasswordModal/UpdateContactPasswordModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/update-contact-password/$contactId',
)({
  component: AppViewEnterpriseViewUpdateContactPasswordView,
})
