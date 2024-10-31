import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewEnterpriseViewUpdateCategoryModalView from '../../../../views/App/views/Enterprise/views/UpdateCategoryModal/UpdateCategoryModal'

export const Route = createLazyFileRoute(
  '/app/enterprises_/$enterpriseId/update-category',
)({
  component: AppViewEnterpriseViewUpdateCategoryModalView,
})
