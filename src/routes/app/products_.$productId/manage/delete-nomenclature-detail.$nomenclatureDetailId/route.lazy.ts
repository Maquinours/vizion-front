import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewProductViewManageViewDeleteNomenclatureDetailModalView from '../../../../../views/App/views/Product/views/Manage/views/DeleteNomenclatureDetailModal/DeleteNomenclatureDetail.Modal'

export const Route = createLazyFileRoute(
  '/app/products_/$productId/manage/delete-nomenclature-detail/$nomenclatureDetailId',
)({
  component: AppViewProductViewManageViewDeleteNomenclatureDetailModalView,
})
