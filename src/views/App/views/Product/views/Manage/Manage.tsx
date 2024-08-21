import { getRouteApi, Outlet } from '@tanstack/react-router';
import styles from './Manage.module.scss';
import AppViewProductViewManageViewAssociatedProductsComponent from './components/AssociatedProducts/AssociatedProducts';
import AppViewProductViewManageViewVersionsComponent from './components/Versions/Versions';
import AppViewProductViewManageViewSpecificationsComponent from './components/Specifications/Specifications';
import AppViewProductViewManageViewStocksComponent from './components/Stocks/Stocks';
import AppViewProductViewManageViewSalesHistoryComponent from './components/SalesHistory/SalesHistory';
import AppViewProductViewManageViewStockMovementHistoryComponent from './components/StockMovementHistory/StockMovementHistory';
import AppViewProductViewManageViewNomenclatureComponent from './components/Nomenclature/Nomenclature';
import { useSuspenseQuery } from '@tanstack/react-query';
import { queries } from '../../../../../../utils/constants/queryKeys';

const routeApi = getRouteApi('/app/products/$productId/manage');

export default function AppViewProductViewManageView() {
  const { productId } = routeApi.useParams();

  const { data: product } = useSuspenseQuery(queries.product.detail(productId));

  return (
    <>
      <div className={styles.container}>
        <AppViewProductViewManageViewAssociatedProductsComponent />
        <AppViewProductViewManageViewVersionsComponent />
        <AppViewProductViewManageViewSpecificationsComponent />
        <AppViewProductViewManageViewStocksComponent />
        <AppViewProductViewManageViewSalesHistoryComponent />
        <AppViewProductViewManageViewStockMovementHistoryComponent />
        {!!product.bom && <AppViewProductViewManageViewNomenclatureComponent />}
      </div>
      <Outlet />
    </>
  );
}
