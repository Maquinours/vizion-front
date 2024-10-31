import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewTaskEmailModalView from '../../../../views/App/views/Enterprise/views/TaskEmailModal/TaskEmailModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/task-email/$taskId',
)({
  component: AppViewEnterpriseViewTaskEmailModalView,
})
