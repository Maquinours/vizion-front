import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewAddSpecificationModalView from '../../../../../views/App/views/Product/views/Manage/views/AddSpecificationModal/AddSpecificationModal';

export const Route = createLazyFileRoute('/app/products_/$productId/manage/add-specification')({
  component: AppViewProductViewManageViewAddSpecificationModalView,
});
