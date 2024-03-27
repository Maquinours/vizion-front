import { Outlet } from '@tanstack/react-router';
import styles from './Manage.module.scss';
import AppViewProductViewManageViewAssociatedProductsComponent from './components/AssociatedProducts/AssociatedProducts';
import AppViewProductViewManageViewVersionsComponent from './components/Versions/Versions';
import AppViewProductViewManageViewSpecificationsComponent from './components/Specifications/Specifications';
import AppViewProductViewManageViewStocksComponent from './components/Stocks/Stocks';
import AppViewProductViewManageViewSalesHistoryComponent from './components/SalesHistory/SalesHistory';
import AppViewProductViewManageViewStockMovementHistoryComponent from './components/StockMovementHistory/StockMovementHistory';

export default function AppViewProductViewManageView() {
  return (
    <>
      <div className={styles.container}>
        <AppViewProductViewManageViewAssociatedProductsComponent />
        <AppViewProductViewManageViewVersionsComponent />
        <AppViewProductViewManageViewSpecificationsComponent />
        <AppViewProductViewManageViewStocksComponent />
        <AppViewProductViewManageViewSalesHistoryComponent />
        <AppViewProductViewManageViewStockMovementHistoryComponent />
      </div>
      <Outlet />
    </>
  );
}
