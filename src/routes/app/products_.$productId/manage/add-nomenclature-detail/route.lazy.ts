import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewProductViewManageViewAddNomenclatureDetailModalView from '../../../../../views/App/views/Product/views/Manage/views/AddNomenclatureDetailModal/AddNomenclatureDetailModal'

export const Route = createLazyFileRoute(
  '/app/products_/$productId/manage/add-nomenclature-detail',
)({
  component: AppViewProductViewManageViewAddNomenclatureDetailModalView,
})
