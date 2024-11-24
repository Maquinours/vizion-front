import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewUpdateSpecificationModalView from '../../../../../views/App/views/Product/views/Manage/views/UpdateSpecificationModal/UpdateSpecificationModal';

export const Route = createLazyFileRoute('/app/products_/$productId/manage/update-specification/$specificationId')({
  component: AppViewProductViewManageViewUpdateSpecificationModalView,
});
