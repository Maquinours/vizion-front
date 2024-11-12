import { Outlet, getRouteApi } from '@tanstack/react-router';
import AppViewProductViewButtonsComponent from './components/Buttons/Buttons';
import AppViewProductViewUpdateModalComponent from './components/UpdateModal/UpdateModal';
import AppViewProductViewDeleteModalComponent from './components/DeleteModal/DeleteModal';
import AppViewProductViewTabsComponent from './components/Tabs/Tabs';

const routeApi = getRouteApi('/app/products_/$productId');

export default function AppViewProductView() {
  const { productModal } = routeApi.useSearch();

  const modal = (() => {
    if (productModal === 'update') return <AppViewProductViewUpdateModalComponent />;
    else if (productModal === 'delete') return <AppViewProductViewDeleteModalComponent />;
  })();

  return (
    <>
      <AppViewProductViewTabsComponent />
      <AppViewProductViewButtonsComponent />
      <Outlet />
      {modal}
    </>
  );
}
