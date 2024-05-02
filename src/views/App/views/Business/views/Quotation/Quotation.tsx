import { Outlet } from '@tanstack/react-router';
import AppViewBusinessViewQuotationViewHeaderComponent from './components/Header/Header';
import AppViewBusinessViewQuotationViewRecapComponent from './components/Recap/Recap';
import AppViewBusinessViewQuotationViewTableComponent from './components/Table/Table';

export default function AppViewBusinessViewQuotationView() {
  return (
    <>
      <AppViewBusinessViewQuotationViewHeaderComponent />
      <AppViewBusinessViewQuotationViewTableComponent />
      <AppViewBusinessViewQuotationViewRecapComponent />
      <Outlet />
    </>
  );
}
