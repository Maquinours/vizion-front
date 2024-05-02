import { Outlet } from '@tanstack/react-router';
import AppViewBusinessViewBpViewFooterComponent from './components/Footer/Footer';
import AppViewBusinessViewBpViewHeaderComponent from './components/Header/Header';
import AppViewBusinessViewBpViewTableComponent from './components/Table/Table';

export default function AppViewBusinessViewBpView() {
  return (
    <>
      <AppViewBusinessViewBpViewHeaderComponent />
      <AppViewBusinessViewBpViewTableComponent />
      <AppViewBusinessViewBpViewFooterComponent />
      <Outlet />
    </>
  );
}
