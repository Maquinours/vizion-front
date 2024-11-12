import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewDeleteModalView from '../../../../views/App/views/Enterprise/views/DeleteModal/DeleteModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/delete',
)({
  component: AppViewEnterpriseViewDeleteModalView,
})
