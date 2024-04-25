import { Outlet } from '@tanstack/react-router';
import AppViewBusinessViewArcViewHeaderComponent from './components/Header/Header';
import AppViewBusinessViewArcViewRecapComponent from './components/Recap/Recap';
import AppViewBusinessViewArcViewTableComponent from './components/Table/Table';

export default function AppViewBusinessViewArcView() {
  return (
    <>
      <AppViewBusinessViewArcViewHeaderComponent />
      <AppViewBusinessViewArcViewTableComponent />
      <AppViewBusinessViewArcViewRecapComponent />
      <Outlet />
    </>
  );
}
