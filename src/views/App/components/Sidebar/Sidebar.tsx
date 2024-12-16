import { getRouteApi } from '@tanstack/react-router';
import SidebarComponentBasicSidebarComponent from './components/BasicSidebar/BasicSidebar';
import SidebarComponentMobileSidebarComponent from './components/MobileSidebar/MobileSideBar';
import styles from './Sidebar.module.scss';
import classNames from 'classnames';

const routeApi = getRouteApi('/app');

export default function AppViewSidebarComponent() {
  const { mobileSidebar } = routeApi.useSearch();

  return (
    <div className={classNames(styles.container, { [styles.mobile_open]: mobileSidebar })}>
      <SidebarComponentBasicSidebarComponent />
      {mobileSidebar && <SidebarComponentMobileSidebarComponent />}
    </div>
  );
}
