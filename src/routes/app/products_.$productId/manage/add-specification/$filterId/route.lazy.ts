import { createLazyFileRoute } from '@tanstack/react-router'
import AppViewProductViewManageViewAddSpecificationModalViewSpecificationModalView from '../../../../../../views/App/views/Product/views/Manage/views/AddSpecificationModal/views/SpecificationModal/SpecificationModal'

export const Route = createLazyFileRoute(
  '/app/products_/$productId/manage/add-specification/$filterId',
)({
  component:
    AppViewProductViewManageViewAddSpecificationModalViewSpecificationModalView,
})
