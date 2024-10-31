import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewProductViewManageViewDeleteSpecificationModalView from '../../../../../views/App/views/Product/views/Manage/views/DeleteSpecificationModal/DeleteSpecificationModal'

export const Route = createLazyFileRoute(
  '/app/products_/$productId/manage/delete-specification/$specificationId',
)({
  component: AppViewProductViewManageViewDeleteSpecificationModalView,
})
