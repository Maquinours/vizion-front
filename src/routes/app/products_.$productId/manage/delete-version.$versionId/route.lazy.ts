import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewProductViewManageViewDeleteVersionModalView from '../../../../../views/App/views/Product/views/Manage/views/DeleteVersionModal/DeleteVersionModal'

export const Route = createLazyFileRoute(
  '/app/products_/$productId/manage/delete-version/$versionId',
)({
  component: AppViewProductViewManageViewDeleteVersionModalView,
})
