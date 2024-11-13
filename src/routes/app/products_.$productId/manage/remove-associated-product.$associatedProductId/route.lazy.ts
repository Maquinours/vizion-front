import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewRemoveAssociatedProductModal from '../../../../../views/App/views/Product/views/Manage/views/RemoveAssociatedProductModal/RemoveAssociatedProductModal';

export const Route = createLazyFileRoute('/app/products_/$productId/manage/remove-associated-product/$associatedProductId')({
  component: AppViewProductViewManageViewRemoveAssociatedProductModal,
});
