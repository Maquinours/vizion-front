import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageView from '../../../../views/App/views/Product/views/Manage/Manage';

export const Route = createLazyFileRoute('/app/products_/$productId/manage')({
  component: AppViewProductViewManageView,
});
