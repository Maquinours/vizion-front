import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewAddAssociatedProductModalView from '../../../../../views/App/views/Product/views/Manage/views/AddAssociatedProductModal/AddAssociatedProductModal';

export const Route = createLazyFileRoute('/app/products_/$productId/manage/add-associated-product')({
  component: AppViewProductViewManageViewAddAssociatedProductModalView,
});
