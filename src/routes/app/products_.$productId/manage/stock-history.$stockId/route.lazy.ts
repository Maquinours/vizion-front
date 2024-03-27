import { createLazyFileRoute } from '@tanstack/react-router';
import AppViewProductViewManageViewStockHistoryModalView from '../../../../../views/App/views/Product/views/Manage/views/StockHistoryModal/StockHistoryModal';

export const Route = createLazyFileRoute('/app/products/$productId/manage/stock-history/$stockId')({
  component: AppViewProductViewManageViewStockHistoryModalView,
});
