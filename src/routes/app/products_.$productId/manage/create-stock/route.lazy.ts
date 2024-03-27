import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewCreateStockModalView from '../../../../../views/App/views/Product/views/Manage/views/CreateStockModal/CreateStockModal';

export const Route = createLazyFileRoute('/app/products/$productId/manage/create-stock')({
  component: AppViewProductViewManageViewCreateStockModalView,
});
