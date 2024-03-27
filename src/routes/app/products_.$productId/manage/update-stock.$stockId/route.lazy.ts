import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewUpdateStockModalView from '../../../../../views/App/views/Product/views/Manage/views/UpdateStockModal/UpdateStockModal';

export const Route = createLazyFileRoute('/app/products/$productId/manage/update-stock/$stockId')({
  component: AppViewProductViewManageViewUpdateStockModalView,
});
