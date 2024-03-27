import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewDeleteStockModalView from '../../../../../views/App/views/Product/views/Manage/views/DeleteStockModal/DeleteStockModal';

export const Route = createLazyFileRoute('/app/products/$productId/manage/delete-stock/$stockId')({
  component: AppViewProductViewManageViewDeleteStockModalView,
});
